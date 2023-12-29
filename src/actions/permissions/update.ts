"use server"

import { revalidatePath } from "next/cache"

import { DataResult } from "@/types/types"
import prismadb from "@/utils/prismadb"

interface IPermission {
  id: number
  name: string
  description: string
  key: string
}

export async function updatePermission({
  id,
  name,
  description,
  key,
}: IPermission): Promise<DataResult<IPermission>> {
  try {
    const errors: { name: string[]; description: string[]; key: string[] } = {
      name: [],
      description: [],
      key: [],
    }
    const permissionAlreadyExists = await prismadb.permission.findUnique({
      where: { name, NOT: { id } },
    })
    if (permissionAlreadyExists) {
      errors.name.push(`A permission with the name '${name}' already exists.`)
    }

    const permissionKeyAlreadyExists = await prismadb.permission.findUnique({
      where: { key, NOT: { id } },
    })
    if (permissionKeyAlreadyExists) {
      errors.key.push(`A permission with the key '${key}' already exists.`)
    }

    if (errors.name.length || errors.description.length || errors.key.length) {
      return { success: false, errors }
    }

    await prismadb.permission.update({
      where: { id },
      data: { name, description, key },
    })

    revalidatePath(`/admin/permissions/`)

    return { success: true }
  } catch (error) {
    return { success: false }
  }
}
