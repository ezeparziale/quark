"use server"

import { redirect } from "next/navigation"

import { auth } from "@/auth"

import prismadb from "@/lib/prismadb"

export async function getCurrentUser(redirectPage?: string) {
  const session = await auth()

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
