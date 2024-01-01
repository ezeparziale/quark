import { NextResponse } from "next/server"

import { getUserByEmail } from "@/data/user"
import { verifyUserToken } from "@/lib/jwt"
import prismadb from "@/utils/prismadb"
import bcrypt from "bcrypt"

export async function GET(req: Request, { params }: { params: { token: string } }) {
  try {
    const { token } = params

    const email = verifyUserToken(token)

    if (!email) {
      return NextResponse.json(
        { message: "Token is invalid or expired" },
        { status: 401 },
      )
    }

    return NextResponse.json({ message: "Token valid" }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: { token: string } }) {
  try {
    const body = await req.json()
    const { password } = body
    const { token } = params

    const email = verifyUserToken(token)

    if (!email) {
      return NextResponse.json(
        { message: "Token is invalid or expired" },
        { status: 401 },
      )
    }

    const existingUser = await getUserByEmail(email)

    if (!existingUser) {
      return NextResponse.json({ error: "Email does not exists" }, { status: 404 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    await prismadb.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        hashedPassword,
      },
    })
    return NextResponse.json({ message: "Password updated" }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
