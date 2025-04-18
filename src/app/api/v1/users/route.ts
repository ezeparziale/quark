import { NextResponse } from "next/server"

import { Prisma } from "@prisma/client"
import { ZodError } from "zod"

import { logActivity } from "@/lib/activity"
import { ApiError, getPagination, parseRequestBody } from "@/lib/api"
import { withAdmin } from "@/lib/auth"
import prismadb from "@/lib/prismadb"
import { getZodSchemaFields } from "@/lib/zod/utils"

import { ActivityType } from "@/schemas/activity-logs"
import {
  userCreateSchema,
  userListQuerySchema,
  userOutputSchema,
} from "@/schemas/users"

const allowedOrderByFields = [
  "id",
  "email",
  "username",
  "isActive",
  "isAdmin",
  "emailVerified",
  "createdAt",
  "updatedAt",
]

const outputFields = getZodSchemaFields(userOutputSchema)

export const GET = withAdmin(async ({ context }) => {
  try {
    const { offset, limit, search, sort } = getPagination(context.searchParams)
    const { isActive } = userListQuerySchema.parse(context.searchParams)

    const filter: Prisma.UserWhereInput = {}
    if (search) {
      filter.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { username: { contains: search, mode: "insensitive" } },
      ]
    }

    if (typeof isActive === "boolean") {
      filter.AND = [{ isActive }]
    }

    const orderBy: Prisma.UserOrderByWithRelationInput[] = []
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

    const [users, totalRows, totalRowsFiltered] = await prismadb.$transaction([
      prismadb.user.findMany({
        where: filter,
        orderBy,
        skip: offset,
        take: limit,
        select: {
          ...outputFields,
          userMetadata: { select: { metadata: true } },
        },
      }),
      prismadb.user.count(),
      prismadb.user.count({
        where: filter,
      }),
    ])

    const pageCount: number = Math.ceil(totalRowsFiltered / limit)

    const headers = {
      "total-count": totalRows.toString(),
      "total-count-filtered": String(totalRowsFiltered),
      "pagination-pages": String(pageCount),
    }

    const data = users.map((user) => {
      const { userMetadata, ...rest } = user
      return {
        ...rest,
        metadata: userMetadata?.metadata,
      }
    })

    return NextResponse.json(data, { status: 200, headers })
  } catch (error) {
    console.error("Error:", error)
    if (error instanceof ZodError) {
      const errorsValidation = error.flatten().fieldErrors
      return NextResponse.json({ errors: errorsValidation }, { status: 422 })
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
})

export const POST = withAdmin(async ({ req, currentUser }) => {
  try {
    const bodyRaw = await parseRequestBody(req)
    const body = userCreateSchema.parse(bodyRaw)
    const { email, username, isActive, emailVerified, isAdmin } = body

    const data = await prismadb.user.create({
      data: { email, username, isActive, emailVerified, isAdmin },
      select: outputFields,
    })

    await logActivity(currentUser.id, ActivityType.CREATE_USER)

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Error:", error)
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.code })
    }
    if (error instanceof ZodError) {
      const errorsValidation = error.flatten().fieldErrors
      return NextResponse.json({ errors: errorsValidation }, { status: 422 })
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002" && error.meta) {
        const meta = error.meta as { target?: string[] }
        const target = meta.target
        if (target && target[0] === "email") {
          return NextResponse.json(
            {
              message: "A user with that email already exists.",
            },
            { status: 409 },
          )
        }
        if (target && target[0] === "username") {
          return NextResponse.json(
            {
              message: "A user with that username already exists.",
            },
            { status: 409 },
          )
        }
      }
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
})
