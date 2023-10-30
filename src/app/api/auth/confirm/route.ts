import { NextResponse } from "next/server"

import ConfirmEmail from "@/emails/confirm-email"
import { sendMail } from "@/services/mail"
import { generate_user_token } from "@/utils/jwt"
import prismadb from "@/utils/prismadb"
import { render } from "@react-email/render"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { email } = body

    const userExist = await prismadb.user.findFirst({ where: { email } })

    if (!userExist) {
      return NextResponse.json({ message: "Email not found" }, { status: 404 })
    }

    if (!userExist.active) {
      return NextResponse.json({ message: "Somenthing went wrong" }, { status: 404 })
    }

    const token: string = generate_user_token(email)

    const url: string = `${process.env.NEXTAUTH_URL}/auth/confirm/${token}`

    const emailHtml = render(ConfirmEmail({ url }))

    await sendMail(email, "Active account", emailHtml)

    return NextResponse.json({ message: "Email sent" }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
