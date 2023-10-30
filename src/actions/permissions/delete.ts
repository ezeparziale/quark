"use server"

import prismadb from "@/utils/prismadb"

interface IDeletePermission {
  id: number
}

export async function deletePermission({ id }: IDeletePermission) {
  try {
    await prismadb.permission.delete({ where: { id } })
    return { success: true }
  } catch (error) {
    return { success: false }
  }
}
