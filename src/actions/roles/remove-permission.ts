"use server"

import prismadb from "@/utils/prismadb"

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
    return { success: true }
  } catch (error) {
    return { success: false }
  }
}
