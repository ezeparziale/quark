import { NextResponse } from "next/server"

import bcrypt from "bcrypt"

import { verifyUserToken } from "@/lib/jwt"
import prismadb from "@/lib/prismadb"

import { getUserByEmail } from "@/data/user"

type Params = Promise<{ token: string }>

export async function POST(req: Request, segmentData: { params: Params }) {
  try {
    const params = await segmentData.params

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
        password: hashedPassword,
      },
    })
    return NextResponse.json({ message: "Password updated" }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
