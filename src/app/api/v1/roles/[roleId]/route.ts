import { NextResponse } from "next/server"

import { Prisma } from "@prisma/client"
import { ZodError } from "zod"

import { ApiError, getIdInputOrThrow, parseRequestBody } from "@/lib/api"
import { withAdmin } from "@/lib/auth"
import prismadb from "@/lib/prismadb"
import { getZodSchemaFields } from "@/lib/zod/utils"

import {
  roleOutputSchema,
  roleUpdatePartialSchema,
  roleUpdateSchema,
} from "@/schemas/roles"

const outputFields = getZodSchemaFields(roleOutputSchema)

export const GET = withAdmin(async ({ params }) => {
  try {
    const { roleId } = params

    const id: number = getIdInputOrThrow(roleId)

    const role = await prismadb.role.findUniqueOrThrow({
      where: { id },
      select: {
        ...outputFields,
        tools: { select: { tool: { select: { id: true, name: true } } } },
        permissions: {
          select: { permission: { select: { id: true, name: true, key: true } } },
        },
      },
    })

    const data = {
      ...role,
      tools: role.tools.map((tool) => ({ id: tool.tool.id, name: tool.tool.name })),
      permissions: role.permissions.map((permission) => ({
        id: permission.permission.id,
        name: permission.permission.name,
        key: permission.permission.key,
      })),
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("Error:", error)
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.code })
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json({ message: "Role not found" }, { status: 404 })
      }
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
})

export const DELETE = withAdmin(async ({ params }) => {
  try {
    const { roleId } = params

    const id: number = getIdInputOrThrow(roleId)

    await prismadb.role.delete({
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
        return NextResponse.json({ message: "Role not found" }, { status: 404 })
      }
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
})

export const PUT = withAdmin(async ({ req, params }) => {
  try {
    const bodyRaw = await parseRequestBody(req)
    const { roleId } = params

    const id: number = getIdInputOrThrow(roleId)
    const isPartial = req.method === "PATCH"

    const schema = isPartial ? roleUpdatePartialSchema : roleUpdateSchema

    const body = schema.parse(bodyRaw)

    const { name, description, key, isActive, tools, permissions } = body

    const updatedRole = await prismadb.role.update({
      where: { id },
      data: {
        name,
        description,
        key,
        isActive,
        tools: tools
          ? {
              deleteMany: {},
              create: tools?.map((toolId) => ({
                tool: { connect: { id: toolId } },
              })),
            }
          : undefined,
        permissions: permissions
          ? {
              deleteMany: {},
              create: permissions?.map((id) => ({
                permission: { connect: { id } },
              })),
            }
          : undefined,
      },
      select: {
        ...outputFields,
        tools: { select: { tool: { select: { id: true, name: true } } } },
        permissions: {
          select: { permission: { select: { id: true, name: true, key: true } } },
        },
      },
    })

    const data = {
      ...updatedRole,
      tools: updatedRole.tools.map((tool) => ({
        id: tool.tool.id,
        name: tool.tool.name,
      })),
      permissions: updatedRole.permissions.map((permission) => ({
        id: permission.permission.id,
        name: permission.permission.name,
        key: permission.permission.key,
      })),
    }

    return NextResponse.json(data, { status: 200 })
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
              message: `A role with the name already exists.`,
            },
            { status: 409 },
          )
        }
        if (target && target[0] === "key") {
          return NextResponse.json(
            {
              message: `A role with the key already exists.`,
            },
            { status: 409 },
          )
        }
      }
      if (error.code === "P2025") {
        const cause = (error.meta?.cause as string) || ""

        if (cause.includes("No 'Permission' record")) {
          return NextResponse.json(
            {
              message: "Permission not found.",
            },
            { status: 404 },
          )
        }

        if (cause.includes("No 'Tool' record")) {
          return NextResponse.json(
            {
              message: "Tool not found.",
            },
            { status: 404 },
          )
        }

        return NextResponse.json(
          {
            message: "Role not found.",
          },
          { status: 404 },
        )
      }
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
})

export const PATCH = PUT
