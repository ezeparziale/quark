import { NextResponse } from "next/server"

import { Prisma } from "@prisma/client"
import { ZodError } from "zod"

import { ApiError, getIdInputOrThrow, parseRequestBody } from "@/lib/api"
import { withAdmin } from "@/lib/auth"
import prismadb from "@/lib/prismadb"
import { getZodSchemaFields } from "@/lib/zod/utils"

import {
  permissionOutputSchema,
  permissionUpdatePartialSchema,
  permissionUpdateSchema,
} from "@/schemas/permissions"

const outputFields = getZodSchemaFields(permissionOutputSchema)

export const GET = withAdmin(async ({ params }) => {
  try {
    const { permissionId } = params

    const id: number = getIdInputOrThrow(permissionId)

    const permission = await prismadb.permission.findUniqueOrThrow({
      where: { id },
      select: outputFields,
    })

    return NextResponse.json(permission, { status: 200 })
  } catch (error) {
    console.error("Error:", error)
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.code })
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json({ message: "Permission not found" }, { status: 404 })
      }
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
})

export const DELETE = withAdmin(async ({ params }) => {
  try {
    const { permissionId } = params

    const id: number = getIdInputOrThrow(permissionId)

    await prismadb.permission.delete({
      where: { id },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error:", error)
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.code })
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json({ message: "Permission not found" }, { status: 404 })
      }
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
})

export const PUT = withAdmin(async ({ req, params }) => {
  try {
    const bodyRaw = await parseRequestBody(req)
    const { permissionId } = params

    const id: number = getIdInputOrThrow(permissionId)
    const isPartial = req.method === "PATCH"

    const schema = isPartial ? permissionUpdatePartialSchema : permissionUpdateSchema

    const body = schema.parse(bodyRaw)

    const { name, description, key, isActive } = body

    const updatedPermission = await prismadb.permission.update({
      where: { id },
      data: { name, description, key, isActive },
      select: outputFields,
    })

    return NextResponse.json(updatedPermission, { status: 200 })
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
        if (target && target[0] === "name") {
          return NextResponse.json(
            {
              message: `A permission with the name already exists.`,
            },
            { status: 409 },
          )
        }
        if (target && target[0] === "key") {
          return NextResponse.json(
            {
              message: `A permission with the key already exists.`,
            },
            { status: 409 },
          )
        }
      }
      if (error.code === "P2025") {
        return NextResponse.json({ message: "Permission not found" }, { status: 404 })
      }
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
})

export const PATCH = PUT
