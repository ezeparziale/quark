"use server"

import prismadb from "@/utils/prismadb"

interface IDeleteRole {
  id: number
}

export async function deleteRole({ id }: IDeleteRole) {
  try {
    await prismadb.role.delete({ where: { id } })
    return { success: true }
  } catch (error) {
    return { success: false }
  }
}
