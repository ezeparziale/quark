"use server"

import { revalidatePath } from "next/cache"

import { DataResult } from "@/types/types"
import prismadb from "@/utils/prismadb"

interface IRole {
  rolesIds: number[] | []
  userId: string
}

export async function addRolesToUser({
  userId,
  rolesIds,
}: IRole): Promise<DataResult<IRole>> {
  try {
    await prismadb.userRole.deleteMany({
      where: { userId: userId },
    })
    const dataToInsert = rolesIds?.map((roleId) => ({ roleId, userId })) || []
    await prismadb.userRole.createMany({ data: dataToInsert })
    revalidatePath(`/admin/users/${userId}/roles`)
    return { success: true }
  } catch (error) {
    return { success: false }
  }
}
