import { NextResponse } from "next/server"

import { Prisma } from "@prisma/client"
import { ZodError } from "zod"

import { logActivity } from "@/lib/activity"
import { ApiError, getIdInputOrThrow, parseRequestBody } from "@/lib/api"
import { withAdmin } from "@/lib/auth"
import prismadb from "@/lib/prismadb"
import { getZodSchemaFields } from "@/lib/zod/utils"

import { ActivityType } from "@/schemas/activity-logs"
import {
  userOutputSchema,
  userUpdatePartialSchema,
  userUpdateSchema,
} from "@/schemas/users"

const outputFields = getZodSchemaFields(userOutputSchema)

export const GET = withAdmin(async ({ context }) => {
  try {
    const { userId } = context.params

    const id: number = getIdInputOrThrow(userId)

    const user = await prismadb.user.findUniqueOrThrow({
      where: { id },
      select: outputFields,
    })

    return NextResponse.json(user, { status: 200 })
  } catch (error) {
    console.error("Error:", error)
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.code })
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json({ message: "User not found" }, { status: 404 })
      }
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
})

export const DELETE = withAdmin(async ({ context, currentUser }) => {
  try {
    const { userId } = context.params

    const id: number = getIdInputOrThrow(userId)

    await prismadb.user.delete({
      where: { id },
    })

    await logActivity(currentUser.id, ActivityType.DELETE_USER)

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error:", error)
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.code })
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json({ message: "User not found" }, { status: 404 })
      }
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
})

export const PUT = withAdmin(async ({ req, context, currentUser }) => {
  try {
    const bodyRaw = await parseRequestBody(req)
    const { userId } = context.params

    const id: number = getIdInputOrThrow(userId)
    const isPartial = req.method === "PATCH"

    const schema = isPartial ? userUpdatePartialSchema : userUpdateSchema

    const body = schema.parse(bodyRaw)

    const { email, username, isActive, emailVerified, isAdmin } = body

    const updatedUser = await prismadb.user.update({
      where: { id },
      data: { email, username, isActive, emailVerified, isAdmin },
      select: outputFields,
    })

    await logActivity(currentUser.id, ActivityType.UPDATE_USER)

    return NextResponse.json(updatedUser, { status: 200 })
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
      if (error.code === "P2025") {
        return NextResponse.json({ message: "User not found" }, { status: 404 })
      }
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
})

export const PATCH = PUT
