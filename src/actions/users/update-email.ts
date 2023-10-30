import UpdateEmail from "@/emails/update-email"
import { env } from "@/env.mjs"
import { getServerAuthSession } from "@/lib/auth"
import { sendMail } from "@/services/mail"
import { generate_user_token } from "@/utils/jwt"
import prismadb from "@/utils/prismadb"
import { render } from "@react-email/render"

type FormDataNewEmail = {
  newEmail: string
}

type DataResult<T> = {
  success: boolean
  errors?: { [P in keyof T]?: string[] }
  message?: String
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

        const token: string = generate_user_token(email)

        const newRequest = await prismadb.changeEmailRequest.create({
          data: {
            userId: user.id,
            oldEmail: user.email,
            newEmail: newEmail,
            token: token,
          },
        })

        const url: string = `${env.NEXTAUTH_URL}/auth/change_email/${token}`

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
