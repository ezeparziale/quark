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

    const tokenExists = await prismadb.changeEmailRequest.findFirst({
      where: { token },
    })

    if (tokenExists && !tokenExists?.isUsed) {
      await prismadb.user.update({
        where: {
          email: userEmail,
        },
        data: {
          email: tokenExists.newEmail,
          confirmedEmail: false,
        },
      })

      await prismadb.changeEmailRequest.update({
        where: { id: tokenExists.id },
        data: {
          isUsed: true,
        },
      })

      return NextResponse.json(
        { message: "Email has been successfully updated" },
        { status: 201 },
      )
    } else {
      return NextResponse.json(
        { message: "Token is invalid or expired" },
        { status: 401 },
      )
    }
  } catch (error: any) {
    return NextResponse.json({ message: "Somenthing went wrong" }, { status: 500 })
  }
}
