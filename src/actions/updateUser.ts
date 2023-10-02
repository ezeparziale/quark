"use server"

import Email from "@/emails/updateEmail"
import { authOptions } from "@/lib/auth"
import { sendMail } from "@/services/mail"
import { generate_user_token } from "@/utils/jwt"
import prismadb from "@/utils/prismadb"
import { render } from "@react-email/render"
import { getServerSession } from "next-auth"

type FormDataUsername = {
  username: string
}

type FormDataDeleteAccount = {
  userEmail: string
  confirmString: string
}

type FormDataNewEmail = {
  newEmail: string
}

type DataResult<T> = {
  success: boolean
  errors?: { [P in keyof T]?: string[] }
  message?: String
}

const THIRTY_DAYS = 30
const TEN_MINUTES_IN_MILLIS = 10 * 60 * 1000

export async function updateUsername({
  username,
}: FormDataUsername): Promise<DataResult<FormDataUsername>> {
  const session = await getServerSession(authOptions)
  try {
    const email = session?.user.email

    if (email) {
      const user = await prismadb.user.findUnique({ where: { email } })

      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - THIRTY_DAYS)

      if (user) {
        if (!user.usernameUpdatedAt || user.usernameUpdatedAt < thirtyDaysAgo) {
          const usernameExists = await prismadb.user.findMany({
            where: {
              username,
              email: {
                not: email,
              },
            },
          })
          if (usernameExists.length === 0) {
            const updateUser = await prismadb.user.update({
              where: { id: user.id },
              data: {
                username,
                usernameUpdatedAt: new Date(),
              },
            })
            return { success: true }
          } else {
            return { success: false, errors: { username: ["Username already exists"] } }
          }
        } else {
          return {
            success: false,
            errors: {
              username: ["It hasn't been 30 days since the last username update"],
            },
          }
        }
      }
    }
    return { success: false }
  } catch (error: any) {
    return { success: false }
  }
}

export async function updateEmail({
  newEmail,
}: FormDataNewEmail): Promise<DataResult<FormDataNewEmail>> {
  const session = await getServerSession(authOptions)
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

        const url: string = `${process.env.NEXTAUTH_URL}/auth/change_email/${token}`

        const emailHtml = render(Email({ username: user.username, newEmail, url }))

        await sendMail(email, "Change email account", emailHtml)

        return { success: true, message: "Check your email to confirm the change" }
      }
    }
    return { success: false }
  } catch (error: any) {
    return { success: false }
  }
}

export async function deleteAccount({
  userEmail,
  confirmString,
}: FormDataDeleteAccount): Promise<DataResult<FormDataDeleteAccount>> {
  const session = await getServerSession(authOptions)
  const errors: { userEmail: string[]; confirmString: string[] } = {
    userEmail: [],
    confirmString: [],
  }
  try {
    const email = session?.user.email

    if (confirmString != "delete my account") {
      errors.confirmString.push("Please type 'delete my account'")
    }

    if (email) {
      const user = await prismadb.user.findUnique({ where: { email } })

      if (user) {
        if (user.email === userEmail) {
          await prismadb.user.delete({
            where: {
              id: user.id,
            },
          })
          return { success: true }
        } else {
          errors.userEmail.push("Wrong email")
        }
      }
    }

    return { success: false, errors: errors }
  } catch (error: any) {
    console.log(error)
    return { success: false }
  }
}
