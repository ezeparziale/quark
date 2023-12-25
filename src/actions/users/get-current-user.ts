"use server"

import { redirect } from "next/navigation"

import { getServerAuthSession } from "@/lib/auth"
import prismadb from "@/utils/prismadb"

export async function getCurrentUser(redirectPage?: string) {
  const session = await getServerAuthSession()

  if (redirectPage) {
    if (!session) {
      redirect(redirectPage)
    }
  }

  try {
    const email = session?.user.email

    if (email) {
      const user = await prismadb.user.findUnique({ where: { email } })
      return user
    }
    return null
  } catch (error: any) {
    return null
  }
}
