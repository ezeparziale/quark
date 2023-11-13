"use server"

import { DataResult } from "@/types/types"
import prismadb from "@/utils/prismadb"

interface IRole {
  id?: (number | undefined)[] | undefined
  userId: string
}

export async function addRolesToUser({
  userId,
  id,
}: IRole): Promise<DataResult<IRole>> {
  try {
    await prismadb.userRole.deleteMany({
      where: { userId: userId },
    })
    const dataToInsert: { roleId: number; userId: string }[] = []
    id?.forEach((value) => {
      dataToInsert.push({ roleId: Number(value), userId: userId })
    })
    await prismadb.userRole.createMany({ data: dataToInsert })
    return { success: true }
  } catch (error) {
    return { success: false }
  }
}
