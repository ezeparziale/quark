import { NextResponse } from "next/server"

import { Prisma } from "@prisma/client"
import { ZodError } from "zod"

import { getPagination, parseRequestBody } from "@/lib/api"
import { withAdmin } from "@/lib/auth"
import prismadb from "@/lib/prismadb"
import { getZodSchemaFields } from "@/lib/zod/utils"

import { userCreateSchema, userOutputSchema } from "@/schemas/users"

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

export const GET = withAdmin(async ({ searchParams }) => {
  try {
    const { offset, limit, search, sort } = getPagination(searchParams)

    const filter: Prisma.UserWhereInput = {}
    if (search) {
      filter.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { username: { contains: search, mode: "insensitive" } },
      ]
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

    const data = await prismadb.user.findMany({
      where: filter,
      orderBy,
      skip: offset,
      take: limit,
      select: outputFields,
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
    const body = userCreateSchema.parse(bodyRaw)
    const { email, username, isActive, emailVerified, isAdmin } = body

    const data = await prismadb.user.create({
      data: { email, username, isActive, emailVerified, isAdmin },
      select: outputFields,
    })

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
