"use server"

import { redirect } from "next/navigation"

import { verifyUserToken } from "@/lib/jwt"
import prismadb from "@/lib/prismadb"

interface IPros {
  token: string
}

export async function changeEmail({ token }: IPros) {
  let result: { success: boolean; error?: string } = {
    success: false,
    error: "Default",
  }
  try {
    const userEmail = verifyUserToken(token)

    if (userEmail) {
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
            emailVerified: false,
          },
        })

        await prismadb.changeEmailRequest.update({
          where: { id: tokenExists.id },
          data: {
            isUsed: true,
          },
        })
        result = { success: true }
      } else {
        result = { success: false, error: "TokenExpired" }
      }
    }
  } catch {
    redirect(`/auth/error`)
  } finally {
    if (result.success) {
      redirect("/auth/logout?callbackUrl=/auth/login?updatedEmail=1")
    } else {
      redirect(`/auth/error?error=${result.error}`)
    }
  }
}
