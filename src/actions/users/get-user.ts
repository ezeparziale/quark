"use server"

import prismadb from "@/lib/prismadb"

export async function getUser(email: string) {
  try {
    const user = await prismadb.user.findUnique({ where: { email } })
    return user
  } catch (error: any) {
    return null
  }
}
