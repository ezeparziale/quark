"use server"

import { authOptions } from "@/lib/auth"
import prismadb from "@/utils/prismadb"
import { getServerSession } from "next-auth"

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
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
