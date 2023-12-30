"use server"

import { revalidatePath } from "next/cache"

import prismadb from "@/utils/prismadb"

interface IDeleteRoleUser {
  roleId: number
  userId: string
}

export async function removeUser({ roleId, userId }: IDeleteRoleUser) {
  try {
    await prismadb.userRole.deleteMany({
      where: { roleId, userId },
    })

    revalidatePath(`/admin/roles/users`)

    return { success: true }
  } catch (error) {
    return { success: false }
  }
}
