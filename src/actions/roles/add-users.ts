"use server"

import prismadb from "@/utils/prismadb"

type DataResult<T> = {
  success: boolean
  errors?: { [P in keyof T]?: string[] }
  message?: String
}

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
    return { success: true }
  } catch (error) {
    return { success: false }
  }
}
