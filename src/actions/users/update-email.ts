"use server"

import UpdateEmail from "@/emails/update-email"
import { env } from "@/env.mjs"
import { render } from "@react-email/render"

import { DataResult } from "@/types/types"

import { getServerAuthSession } from "@/lib/auth"
import { generateUserToken } from "@/lib/jwt"
import { sendMail } from "@/lib/mail"
import prismadb from "@/lib/prismadb"

type FormDataNewEmail = {
  newEmail: string
}

const TEN_MINUTES_IN_MILLIS = 10 * 60 * 1000

export async function updateEmail({
  newEmail,
}: FormDataNewEmail): Promise<DataResult<FormDataNewEmail>> {
  const session = await getServerAuthSession()
  try {
    const email = session?.user.email

    if (email) {
      const user = await prismadb.user.findUnique({ where: { email } })

      if (user) {
        const emailAlreadyExists = await prismadb.user.findUnique({
          where: { email: newEmail },
        })
        if (emailAlreadyExists) {
          return {
            success: false,
            errors: {
              newEmail: [
                `An active account with the email ${newEmail} already exists.`,
              ],
            },
          }
        }

        const requestPending = await prismadb.changeEmailRequest.findFirst({
          where: { userId: user.id, isUsed: false },
          orderBy: { createdAt: "desc" },
        })

        if (requestPending) {
          const currentTime = new Date().getTime()
          const requestTime = requestPending.createdAt.getTime()
          const timeDifference = currentTime - requestTime
          if (timeDifference < TEN_MINUTES_IN_MILLIS) {
            const waitTime = Math.floor(
              (TEN_MINUTES_IN_MILLIS - timeDifference) / 60 / 1000,
            )
            return {
              success: false,
              errors: {
                newEmail: [
                  `You have a pending request. Please wait for ${waitTime} minutes before generating another request.`,
                ],
              },
            }
          }
        }

        const token: string = generateUserToken(email)

        const newRequest = await prismadb.changeEmailRequest.create({
          data: {
            userId: user.id,
            oldEmail: user.email,
            newEmail: newEmail,
            token: token,
          },
        })

        const url: string = `${env.NEXTAUTH_URL}/auth/change-email/${token}`

        const emailHtml = render(
          UpdateEmail({ username: user.username, newEmail, url }),
        )

        await sendMail(email, "Change email account", emailHtml)

        return { success: true, message: "Check your email to confirm the change" }
      }
    }
    return { success: false }
  } catch (error: any) {
    return { success: false }
  }
}
