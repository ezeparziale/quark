import { NextResponse } from "next/server"

import prismadb from "@/utils/prismadb"
import bcrypt from "bcrypt"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { username, email, password } = body

    const errors = []

    const usernameExists = await prismadb.user.findUnique({ where: { username } })

    if (usernameExists) {
      errors.push({ message: "Username already exists", field: "username" })
    }

    const emailExists = await prismadb.user.findUnique({ where: { email } })

    if (emailExists) {
      errors.push({ message: "Email already exists", field: "email" })
    }

    if (errors.length) {
      return NextResponse.json(errors, { status: 400 })
    }
    const hashedPassword = await bcrypt.hash(password, 12)

    const newUser = await prismadb.user.create({
      data: {
        username,
        email,
        hashedPassword,
        active: true,
        confirmedEmail: false,
      },
    })

    return NextResponse.json({ message: "User created successfully" }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: "Somenthing went wrong" }, { status: 500 })
  }
}
