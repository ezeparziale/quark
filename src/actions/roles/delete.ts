"use server"

import { revalidatePath } from "next/cache"

import prismadb from "@/utils/prismadb"

interface IDeleteRole {
  id: number
}

export async function deleteRole({ id }: IDeleteRole) {
  try {
    await prismadb.role.delete({ where: { id } })

    revalidatePath(`/admin/roles/`)

    return { success: true }
  } catch (error) {
    return { success: false }
  }
}
