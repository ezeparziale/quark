import { NextResponse } from "next/server"

import { Prisma } from "@prisma/client"
import { ZodError } from "zod"

import { getPagination, parseRequestBody } from "@/lib/api"
import { withAdmin } from "@/lib/auth"
import prismadb from "@/lib/prismadb"
import { getZodSchemaFields } from "@/lib/zod/utils"

import { roleCreateSchema, roleOutputSchema } from "@/schemas/roles"

const allowedOrderByFields = [
  "id",
  "name",
  "description",
  "key",
  "createdAt",
  "updatedAt",
]

const outputFields = getZodSchemaFields(roleOutputSchema)

export const GET = withAdmin(async ({ searchParams }) => {
  try {
    const { offset, limit, search, sort } = getPagination(searchParams)
    const filter: Prisma.RoleWhereInput = {}
    if (search) {
      filter.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { key: { contains: search, mode: "insensitive" } },
      ]
    }

    const orderBy: Prisma.RoleOrderByWithRelationInput[] = []
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

    const roles = await prismadb.role.findMany({
      where: filter,
      orderBy,
      skip: offset,
      take: limit,
      select: {
        ...outputFields,
        tools: { select: { tool: { select: { id: true, name: true } } } },
        permissions: {
          select: { permission: { select: { id: true, name: true, key: true } } },
        },
      },
    })

    const data = roles.map((role) => {
      return {
        ...role,
        tools: role.tools.map((tool) => ({ id: tool.tool.id, name: tool.tool.name })),
        permissions: role.permissions.map((permission) => ({
          id: permission.permission.id,
          name: permission.permission.name,
          key: permission.permission.key,
        })),
      }
    })

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
})

export const POST = withAdmin(async ({ req }) => {
  try {
    const bodyRaw = await parseRequestBody(req)
    const body = roleCreateSchema.parse(bodyRaw)
    const { name, description, key, tools, permissions } = body

    const newRole = await prismadb.role.create({
      data: {
        name,
        description,
        key,
        tools: {
          create: tools?.map((toolId) => ({
            tool: { connect: { id: toolId } },
          })),
        },
        permissions: {
          create: permissions?.map((permissionId) => ({
            permission: { connect: { id: permissionId } },
          })),
        },
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
      ...newRole,
      tools: newRole.tools.map((tool) => ({ id: tool.tool.id, name: tool.tool.name })),
      permissions: newRole.permissions.map((permission) => ({
        id: permission.permission.id,
        name: permission.permission.name,
        key: permission.permission.key,
      })),
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Error:", error)
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
              message: "One or more Permissions not found.",
            },
            { status: 404 },
          )
        }

        if (cause.includes("No 'Tool' record")) {
          return NextResponse.json(
            {
              message: "One or more Tools not found.",
            },
            { status: 404 },
          )
        }
      }
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
})
