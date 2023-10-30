"use server"

import { getServerAuthSession } from "@/lib/auth"
import prismadb from "@/utils/prismadb"

export async function getCurrentUser() {
  const session = await getServerAuthSession()
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
