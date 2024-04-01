"use server"

import { revalidatePath } from "next/cache"

import prismadb from "@/lib/prismadb"
import { has } from "@/lib/rbac"
import { DataResult } from "@/types/types"

interface IRole {
  userId: string
  roleIds: number[] | []
}

export async function addRolesToUser({
  userId,
  roleIds,
}: IRole): Promise<DataResult<IRole>> {
  try {
    const isAuthorized = await has({ role: "admin" })

    if (!isAuthorized) {
      return { success: false, message: "Unauthorized" }
    }

    const currentRoles = await prismadb.userRole.findMany({
      where: { userId },
      select: { roleId: true },
    })

    const currentRoleIds = new Set(currentRoles.map((role) => role.roleId))
    const newRoleIds = new Set(roleIds?.map((roleId) => roleId) || [])
    const rolesToDelete = currentRoles.filter((role) => !newRoleIds.has(role.roleId))
    const rolesToAdd = roleIds?.filter((roleId) => !currentRoleIds.has(roleId)) || []
    const dataToInsert = rolesToAdd.map((roleId) => ({
      userId,
      roleId,
    }))

    await prismadb.userRole.deleteMany({
      where: {
        userId,
        roleId: {
          in: rolesToDelete.map((role) => role.roleId),
        },
      },
    })

    await prismadb.userRole.createMany({ data: dataToInsert })

    revalidatePath(`/admin/users/${userId}/roles`)

    return { success: true }
  } catch (error) {
    console.error("Error adding role:", error)
    return { success: false, message: "Something went wrong" }
  }
}
