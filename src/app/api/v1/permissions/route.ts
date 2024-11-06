import { NextResponse } from "next/server"

import { Prisma } from "@prisma/client"
import { ZodError } from "zod"

import { ApiError, getPagination, parseRequestBody } from "@/lib/api"
import { withAdmin } from "@/lib/auth"
import prismadb from "@/lib/prismadb"
import { getZodSchemaFields } from "@/lib/zod/utils"

import { permissionCreateSchema, permissionOutputSchema } from "@/schemas/permissions"

const allowedOrderByFields = [
  "id",
  "name",
  "description",
  "key",
  "isActive",
  "createdAt",
  "updatedAt",
]

const outputFields = getZodSchemaFields(permissionOutputSchema)

export const GET = withAdmin(async ({ searchParams }) => {
  try {
    const { offset, limit, search, sort } = getPagination(searchParams)

    const filter: Prisma.PermissionWhereInput = {}
    if (search) {
      filter.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { key: { contains: search, mode: "insensitive" } },
      ]
    }

    const orderBy: Prisma.PermissionOrderByWithRelationInput[] = []
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

    const [data, totalRows, totalRowsFiltered] = await prismadb.$transaction([
      prismadb.permission.findMany({
        where: filter,
        orderBy,
        skip: offset,
        take: limit,
        select: outputFields,
      }),
      prismadb.permission.count(),
      prismadb.permission.count({
        where: filter,
      }),
    ])

    const pageCount: number = Math.ceil(totalRowsFiltered / limit)

    const headers = {
      "total-count": totalRows.toString(),
      "total-count-filtered": String(totalRowsFiltered),
      "pagination-pages": String(pageCount),
    }

    return NextResponse.json(data, { status: 200, headers })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
})

export const POST = withAdmin(async ({ req }) => {
  try {
    const bodyRaw = await parseRequestBody(req)
    const body = permissionCreateSchema.parse(bodyRaw)
    const { name, description, key, isActive } = body

    const data = await prismadb.permission.create({
      data: { name, description, key, isActive },
      select: outputFields,
    })

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
        if (target && target[0] === "name") {
          return NextResponse.json(
            {
              message: "A permission with that name already exists.",
            },
            { status: 409 },
          )
        }
        if (target && target[0] === "key") {
          return NextResponse.json(
            {
              message: "A permission with that key already exists.",
            },
            { status: 409 },
          )
        }
      }
    }
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
})
