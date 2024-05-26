"use server"

import { revalidatePath } from "next/cache"

import { DataResult } from "@/types/types"

import prismadb from "@/lib/prismadb"
import { has } from "@/lib/rbac"

interface IRole {
  roleId: number
  permissionIds?: number[] | undefined
}

export async function addPermissionsToRoles({
  roleId,
  permissionIds,
}: IRole): Promise<DataResult<IRole>> {
  try {
    const isAuthorized = await has({ role: "admin" })

    if (!isAuthorized) {
      return { success: false, message: "Unauthorized" }
    }

    const currentPermissions = await prismadb.rolePermission.findMany({
      where: { roleId },
      select: { permissionId: true },
    })

    const currentPermissionIds = new Set(
      currentPermissions.map((permission) => permission.permissionId),
    )
    const newPermissionIds = new Set(
      permissionIds?.map((permissionId) => permissionId) || [],
    )
    const permissionsToDelete = currentPermissions.filter(
      (permission) => !newPermissionIds.has(permission.permissionId),
    )
    const permissionsToAdd =
      permissionIds?.filter(
        (permissionId) => !currentPermissionIds.has(permissionId),
      ) || []
    const dataToInsert = permissionsToAdd.map((permissionId) => ({
      roleId,
      permissionId,
    }))

    await prismadb.rolePermission.deleteMany({
      where: {
        roleId: roleId,
        permissionId: {
          in: permissionsToDelete.map((permission) => permission.permissionId),
        },
      },
    })

    await prismadb.rolePermission.createMany({ data: dataToInsert })

    revalidatePath(`/admin/roles/${roleId}/permissions`)

    return { success: true }
  } catch (error) {
    console.error("Error adding permission:", error)
    return { success: false, message: "Something went wrong" }
  }
}
