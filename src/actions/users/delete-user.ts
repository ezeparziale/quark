"use server"

import { revalidatePath } from "next/cache"

import prismadb from "@/lib/prismadb"
import { has } from "@/lib/rbac"

interface IDeleteUser {
  id: number
}

export async function deleteUser({ id }: IDeleteUser) {
  try {
    const isAuthorized = await has({ role: "admin" })

    if (!isAuthorized) {
      return { success: false, message: "Unauthorized" }
    }

    await prismadb.user.delete({ where: { id } })

    revalidatePath(`/admin/users`)

    return { success: true }
  } catch (error) {
    return { success: false, message: "Something went wrong" }
  }
}
