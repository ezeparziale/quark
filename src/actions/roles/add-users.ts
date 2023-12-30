"use server"

import { revalidatePath } from "next/cache"

import { DataResult } from "@/types/types"
import prismadb from "@/utils/prismadb"

interface IRole {
  id?: (string | undefined)[] | undefined
  roleId: string
}

export async function addUsersToRoles({
  roleId,
  id,
}: IRole): Promise<DataResult<IRole>> {
  try {
    await prismadb.userRole.deleteMany({
      where: { roleId: Number(roleId) },
    })
    const dataToInsert: { roleId: number; userId: string }[] = []
    id?.forEach((value) => {
      dataToInsert.push({ roleId: Number(roleId), userId: String(value) })
    })
    await prismadb.userRole.createMany({ data: dataToInsert })

    revalidatePath(`/admin/roles/users`)

    return { success: true }
  } catch (error) {
    return { success: false }
  }
}
