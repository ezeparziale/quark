"use server"

import { DataResult } from "@/types/types"
import prismadb from "@/utils/prismadb"

interface IPermission {
  id: number
  name: string
  description: string
}

export async function editPermission({
  id,
  name,
  description,
}: IPermission): Promise<DataResult<IPermission>> {
  try {
    const errors: { name: string[]; description: string[] } = {
      name: [],
      description: [],
    }
    const permissionAlreadyExists = await prismadb.permission.findUnique({
      where: { name, NOT: { id } },
    })
    if (permissionAlreadyExists) {
      errors.name.push(`A permission with the name ${name} already exists.`)
    }

    if (errors.name.length || errors.description.length) {
      return { success: false, errors }
    }

    await prismadb.permission.update({
      where: { id },
      data: { name, description },
    })
    return { success: true }
  } catch (error) {
    return { success: false }
  }
}
