import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"

import { Permission, Prisma, Token, TokenPermission } from "@prisma/client"
import { ZodError } from "zod"
import * as z from "zod"

import { logActivity } from "@/lib/activity"
import { ApiError, getPagination, parseRequestBody } from "@/lib/api"
import { createTokenApi, withAdmin } from "@/lib/auth"
import prismadb from "@/lib/prismadb"

import { ActivityType } from "@/schemas/activity-logs"
import {
  tokenCreateOutputSchema,
  tokenCreateSchema,
  tokenOutputSchema,
} from "@/schemas/tokens"

const allowedOrderByFields = [
  "id",
  "name",
  "username",
  "token",
  "createdAt",
  "updatedAt",
]

export const GET = withAdmin(async ({ context }) => {
  try {
    // Pagination & filters
    const { offset, limit, search, sort } = getPagination(context.searchParams)
    const filter: Prisma.TokenWhereInput = {}

    if (search) {
      filter.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { user: { username: { contains: search, mode: "insensitive" } } },
        { partialToken: { contains: search, mode: "insensitive" } },
      ]
    }

    // Sorting
    const orderBy: Prisma.TokenOrderByWithRelationInput[] = []
    if (sort) {
      const fields = sort.split(",")
      fields.forEach((field) => {
        const isDesc = field.startsWith("-")
        const fieldName = isDesc ? field.substring(1) : field

        if (allowedOrderByFields.includes(fieldName)) {
          orderBy.push({ [fieldName]: isDesc ? "desc" : "asc" })
        }
      })
    } else {
      orderBy.push({ id: "asc" })
    }

    // Database query
    const [tokens, totalRows, totalRowsFiltered] = await prismadb.$transaction([
      prismadb.token.findMany({
        where: filter,
        orderBy,
        skip: offset,
        take: limit,
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      }),
      prismadb.token.count(),
      prismadb.token.count({
        where: filter,
      }),
    ])

    // Pagination headers
    const pageCount: number = Math.ceil(totalRowsFiltered / limit)

    const headers = {
      "total-count": totalRows.toString(),
      "total-count-filtered": String(totalRowsFiltered),
      "pagination-pages": String(pageCount),
    }

    // Data transformation
    const transformedData = tokens.map((token) => ({
      ...token,
      permissions:
        token.type === "inherit"
          ? null
          : token.permissions.map((p) => ({
              id: p.permission.id,
              name: p.permission.name,
            })),
      permissionIds:
        token.type === "inherit" ? null : token.permissions.map((p) => p.permission.id),
    }))

    // data validation
    const parsed = z.array(tokenOutputSchema).safeParse(transformedData)

    if (!parsed.success) {
      throw new Error("Invalid token data")
    }

    // Success response
    return NextResponse.json(parsed.data, { status: 200, headers })
  } catch (error) {
    // Handle errors
    console.error("Error:", error)
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.code })
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
})

type NewToken = Token & {
  permissions: (TokenPermission & {
    permission: Permission
  })[]
}

export const POST = withAdmin(async ({ req, currentUser }) => {
  console.log("Creating token...")

  try {
    // Parse and validate the request body and params
    const bodyRaw = await parseRequestBody(req)
    const body = tokenCreateSchema.parse(bodyRaw)
    const { name, userId, type, permissionIds } = body

    // Check if the permissions exist
    if (permissionIds && permissionIds.length > 0) {
      const existingPermissions = await prismadb.permission.findMany({
        where: { id: { in: permissionIds } },
        select: { id: true },
      })

      const existingIds = new Set(existingPermissions.map((p) => p.id))
      const notFoundIds = permissionIds.filter((id) => !existingIds.has(id))

      if (notFoundIds.length > 0) {
        return NextResponse.json(
          {
            message: "One or more permissions were not found.",
            details: {
              missing_ids: notFoundIds,
            },
          },
          { status: 404 },
        )
      }
    }

    // Create token
    const { token, hashedToken, partialToken } = await createTokenApi()

    let newToken: NewToken

    if (type === "custom" && permissionIds && permissionIds.length > 0) {
      newToken = await prismadb.token.create({
        data: {
          name,
          hashedToken,
          partialToken,
          userId,
          type,
          permissions: {
            create: permissionIds.map((id: number) => ({
              permission: { connect: { id } },
              createdBy: currentUser.email,
            })),
          },
          createdBy: currentUser.email,
          updatedBy: currentUser.email,
        },
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      })
    } else {
      newToken = await prismadb.token.create({
        data: {
          name,
          hashedToken,
          partialToken,
          userId,
          type: "inherit",
          createdBy: currentUser.email,
          updatedBy: currentUser.email,
        },
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      })
    }

    // Log the activity
    await logActivity(currentUser.id, ActivityType.CREATE_TOKEN)

    // Prepare the response data
    const data = {
      ...newToken,
      token,
      expires: newToken.expires ? new Date(newToken.expires) : undefined,
      lastUsed: newToken.lastUsed ? new Date(newToken.lastUsed) : undefined,
      permissions: newToken.permissions.map((p) => ({
        id: p.permission.id,
        name: p.permission.name,
      })),
      permissionIds: newToken.permissions.map((p) => p.permission.id),
    }

    // Parse the output data
    const parsedData = tokenCreateOutputSchema.safeParse(data)

    if (!parsedData.success) {
      console.error(parsedData.error)
      return NextResponse.json(
        { message: "Internal Server Error" },
        {
          status: 500,
        },
      )
    }

    revalidatePath("/admin/tokens")

    return NextResponse.json(parsedData.data, { status: 201 })
  } catch (error) {
    // Handle errors
    console.error("Error:", error)
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.code })
    }
    if (error instanceof ZodError) {
      const errorsValidation = z.flattenError(error).fieldErrors
      return NextResponse.json({ errors: errorsValidation }, { status: 422 })
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        const cause = (error.meta?.cause as string) || ""

        if (cause.includes("No 'Permission' record")) {
          return NextResponse.json(
            {
              message: "One or more permissions were not found.",
              details: {
                missing_ids: [],
              },
            },
            { status: 404 },
          )
        }
      }
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})
