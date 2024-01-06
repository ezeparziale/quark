import { NextResponse } from "next/server"

import { getUserByEmail } from "@/data/user"
import ResetPasswordEmail from "@/emails/reset-email"
import { env } from "@/env.mjs"
import { generateUserToken } from "@/lib/jwt"
import { sendMail } from "@/lib/mail"
import prismadb from "@/utils/prismadb"
import { render } from "@react-email/render"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { email } = body

    const existingUser = await getUserByEmail(email)

    if (!existingUser) {
      return NextResponse.json({ error: "Email does not exists" }, { status: 404 })
    }

    const token: string = generateUserToken(email)

    const url: string = `${env.NEXTAUTH_URL}/auth/reset-password/${token}`

    const emailHtml = render(ResetPasswordEmail({ url }))

    await sendMail(email, "Reset password", emailHtml)

    return NextResponse.json({ message: "Email sent" }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
