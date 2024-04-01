"use server"

import { revalidatePath } from "next/cache"

import prismadb from "@/lib/prismadb"
import { has } from "@/lib/rbac"
import { DataResult } from "@/types/types"

interface IRole {
  roleId: string
  permissionIds?: (string | undefined)[] | undefined
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
      where: { roleId: Number(roleId) },
      select: { permissionId: true },
    })

    const currentPermissionIds = new Set(
      currentPermissions.map((permission) => permission.permissionId),
    )
    const newPermissionIds = new Set(
      permissionIds?.map((permissionId) => Number(permissionId)) || [],
    )
    const permissionsToDelete = currentPermissions.filter(
      (permission) => !newPermissionIds.has(permission.permissionId),
    )
    const permissionsToAdd =
      permissionIds?.filter(
        (permissionId) => !currentPermissionIds.has(Number(permissionId)),
      ) || []
    const dataToInsert = permissionsToAdd.map((permissionId) => ({
      roleId: Number(roleId),
      permissionId: Number(permissionId),
    }))

    await prismadb.rolePermission.deleteMany({
      where: {
        roleId: Number(roleId),
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
