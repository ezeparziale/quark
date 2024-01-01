import { NextResponse } from "next/server"

import { verifyUserToken } from "@/lib/jwt"
import prismadb from "@/utils/prismadb"

export async function GET(req: Request, { params }: { params: { token: string } }) {
  try {
    const { token } = params

    const userEmail = verifyUserToken(token)

    if (userEmail === false) {
      return NextResponse.json(
        { message: "Token is invalid or expired" },
        { status: 401 },
      )
    }

    await prismadb.user.update({
      where: {
        email: userEmail,
      },
      data: {
        confirmedEmail: true,
      },
    })

    return NextResponse.json({ message: "Email activated" }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
