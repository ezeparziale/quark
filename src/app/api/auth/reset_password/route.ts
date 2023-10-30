import { NextResponse } from "next/server"

import ResetPasswordEmail from "@/emails/reset-email"
import { env } from "@/env.mjs"
import { sendMail } from "@/services/mail"
import { generate_user_token } from "@/utils/jwt"
import prismadb from "@/utils/prismadb"
import { render } from "@react-email/render"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { email } = body

    const userExists = await prismadb.user.findUnique({ where: { email } })

    if (!userExists) {
      return NextResponse.json({ error: "Email not exists" }, { status: 404 })
    }

    const token: string = generate_user_token(email)

    const url: string = `${env.NEXTAUTH_URL}/auth/reset_password/${token}`

    const emailHtml = render(ResetPasswordEmail({ url }))

    await sendMail(email, "Reset password", emailHtml)

    return NextResponse.json({ message: "Email sent" }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
