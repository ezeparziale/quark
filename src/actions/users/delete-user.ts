"use server"

import { revalidatePath } from "next/cache"

import prismadb from "@/utils/prismadb"

interface IDeleteUser {
  id: string
}

export async function deleteUser({ id }: IDeleteUser) {
  try {
    await prismadb.user.delete({ where: { id } })

    revalidatePath(`/admin/users`)

    return { success: true }
  } catch (error) {
    return { success: false }
  }
}
