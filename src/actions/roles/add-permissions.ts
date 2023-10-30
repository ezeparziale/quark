"use server"

import { DataResult } from "@/types/types"
import prismadb from "@/utils/prismadb"

interface IRole {
  id?: (string | undefined)[] | undefined
  roleId: string
}

export async function addPermissionsToRoles({
  roleId,
  id,
}: IRole): Promise<DataResult<IRole>> {
  try {
    await prismadb.rolePermission.deleteMany({
      where: { roleId: Number(roleId) },
    })
    const dataToInsert: { roleId: number; permissionId: number }[] = []
    id?.forEach((value) => {
      dataToInsert.push({ roleId: Number(roleId), permissionId: Number(value) })
    })
    await prismadb.rolePermission.createMany({ data: dataToInsert })
    return { success: true }
  } catch (error) {
    return { success: false }
  }
}
