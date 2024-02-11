"use server"

import { revalidatePath } from "next/cache"

import prismadb from "@/lib/prismadb"

interface IDeleteRolePermission {
  roleId: number
  permissionId: number
}

export async function removePermission({
  roleId,
  permissionId,
}: IDeleteRolePermission) {
  try {
    await prismadb.rolePermission.deleteMany({
      where: { roleId, permissionId },
    })

    revalidatePath(`/admin/roles/permissions`)

    return { success: true }
  } catch (error) {
    return { success: false }
  }
}
