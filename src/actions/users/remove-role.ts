"use server"

import { revalidatePath } from "next/cache"

import prismadb from "@/utils/prismadb"

interface IDeleteRoleUser {
  roleId: number
  userId: string
}

export async function removeRolToUser({ roleId, userId }: IDeleteRoleUser) {
  try {
    await prismadb.userRole.deleteMany({
      where: { roleId, userId },
    })

    revalidatePath(`/admin/users/${userId}/roles`)

    return { success: true }
  } catch (error) {
    return { success: false }
  }
}
