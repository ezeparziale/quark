"use server"

import { revalidatePath } from "next/cache"

import prismadb from "@/utils/prismadb"

interface IDeletePermission {
  id: number
}

export async function deletePermission({ id }: IDeletePermission) {
  try {
    await prismadb.permission.delete({ where: { id } })

    revalidatePath(`/admin/permissions/`)

    return { success: true }
  } catch (error) {
    return { success: false }
  }
}
