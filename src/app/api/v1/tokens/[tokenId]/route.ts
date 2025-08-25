import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"

import { Prisma } from "@prisma/client"
import { ZodError } from "zod"
import * as z from "zod"

import { logActivity } from "@/lib/activity"
import { ApiError, getIdStringInputOrThrow, parseRequestBody } from "@/lib/api"
import { withAdmin } from "@/lib/auth"
import prismadb from "@/lib/prismadb"
import { diffArrays } from "@/lib/utils"

import { ActivityType } from "@/schemas/activity-logs"
import {
  tokenOutputSchema,
  tokenPathParamSchema,
  tokenUpdatePartialSchema,
  tokenUpdateSchema,
} from "@/schemas/tokens"

export const GET = withAdmin(async ({ context }) => {
  try {
    const { tokenId } = tokenPathParamSchema.parse(context.params)

    const token = await prismadb.token.findUniqueOrThrow({
      where: {
        id: tokenId,
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    })

    const data = {
      ...token,
      expires: token.expires ? new Date(token.expires) : undefined,
      lastUsed: token.lastUsed ? new Date(token.lastUsed) : undefined,
      permissions: token.permissions.map((p) => ({
        id: p.permission.id,
        name: p.permission.name,
      })),
      permissionIds: token.permissions.map((p) => p.permission.id),
    }

    const parsedData = tokenOutputSchema.safeParse(data)

    if (!parsedData.success) {
      console.error(parsedData.error)
      return NextResponse.json(
        { message: "Internal Server Error" },
        {
          status: 500,
        },
      )
    }

    return NextResponse.json(parsedData.data)
  } catch (error) {
    console.error("Error:", error)
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.code })
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json({ message: "Token not found" }, { status: 404 })
      }
    }
    if (error instanceof ZodError) {
      const errorsValidation = z.flattenError(error).fieldErrors
      return NextResponse.json({ errors: errorsValidation }, { status: 422 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
})

export const DELETE = withAdmin(async ({ context }) => {
  try {
    const { tokenId } = tokenPathParamSchema.parse(context.params)

    await prismadb.token.delete({
      where: { id: tokenId },
    })

    revalidatePath("/admin/tokens")

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error:", error)
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.code })
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json({ message: "Token not found" }, { status: 404 })
      }
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
})

export const PUT = withAdmin(async ({ req, context, currentUser }) => {
  try {
    // Parse and validate the request body and params
    const bodyRaw = await parseRequestBody(req)
    const { tokenId } = context.params
    const id: string = getIdStringInputOrThrow(tokenId)
    const isPartial = req.method === "PATCH"
    const schema = isPartial ? tokenUpdatePartialSchema : tokenUpdateSchema
    const body = schema.parse(bodyRaw)
    const { name, isActive, type, permissionIds } = body

    // Check if the token exists
    const existingToken = await prismadb.token.findUnique({
      where: { id },
      select: {
        permissions: {
          select: { permissionId: true },
        },
      },
    })

    if (!existingToken) {
      return NextResponse.json({ message: "Token not found" }, { status: 404 })
    }

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

    // Calculate permissions to add and remove
    const currentIds = existingToken.permissions.map((p) => p.permissionId)
    const newIds = permissionIds ?? []
    const { toAdd, toDelete } = diffArrays(currentIds, newIds)

    // Update the token
    const updatedToken = await prismadb.token.update({
      where: { id },
      data: {
        name,
        isActive,
        type,
        updatedBy: currentUser.email,
        permissions: {
          deleteMany: toDelete.map((permissionId) => ({
            tokenId: id,
            permissionId,
          })),
          create: toAdd.map((permissionId) => ({
            permission: {
              connect: { id: permissionId },
            },
            createdBy: currentUser.email,
          })),
        },
      },
      select: {
        id: true,
        name: true,
        partialToken: true,
        expires: true,
        lastUsed: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        type: true,
        isActive: true,
        permissions: {
          orderBy: {
            permission: {
              name: "asc",
            },
          },
          select: {
            permission: { select: { id: true, name: true, key: true } },
          },
        },
      },
    })

    // Log the activity
    await logActivity(currentUser.id, ActivityType.UPDATE_TOKEN)

    // Prepare the response data
    const data = {
      ...updatedToken,
      expires: updatedToken.expires ? new Date(updatedToken.expires) : undefined,
      lastUsed: updatedToken.lastUsed ? new Date(updatedToken.lastUsed) : undefined,
      permissions: updatedToken.permissions.map((p) => ({
        id: p.permission.id,
        name: p.permission.name,
      })),
      permissionIds: updatedToken.permissions.map((p) => p.permission.id),
    }

    // Parse the output data
    const parsedData = tokenOutputSchema.safeParse(data)

    if (!parsedData.success) {
      console.error(parsedData.error)
      return NextResponse.json(
        { message: "Internal Server Error" },
        {
          status: 500,
        },
      )
    }

    return NextResponse.json(parsedData.data, { status: 200 })
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

        return NextResponse.json(
          {
            message: "Token not found.",
          },
          { status: 404 },
        )
      }
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
})

// PATCH is an alias for PUT
export const PATCH = PUT
