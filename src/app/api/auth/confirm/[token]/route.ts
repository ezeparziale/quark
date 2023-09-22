import { NextResponse } from "next/server"

import { verify_user_token } from "@/utils/jwt"
import prismadb from "@/utils/prismadb"

export async function GET(req: Request, { params }: { params: { token: string } }) {
  try {
    const { token } = params

    const userEmail = verify_user_token(token)

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
