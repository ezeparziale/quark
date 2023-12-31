"use server"

import { revalidatePath } from "next/cache"

import { DataResult } from "@/types/types"
import prismadb from "@/utils/prismadb"

interface IRole {
  id: number
  name: string
  description: string
  key: string
}

export async function updateRole({
  id,
  name,
  description,
  key,
}: IRole): Promise<DataResult<IRole>> {
  try {
    const errors: { name: string[]; description: string[]; key: string[] } = {
      name: [],
      description: [],
      key: [],
    }
    const roleAlreadyExists = await prismadb.role.findUnique({
      where: { name, NOT: { id } },
    })
    if (roleAlreadyExists) {
      errors.name.push(`A role with the name '${name}' already exists.`)
    }

    const roleKeyAlreadyExists = await prismadb.role.findUnique({
      where: { key, NOT: { id } },
    })
    if (roleKeyAlreadyExists) {
      errors.key.push(`A role with the key '${key}' already exists.`)
    }

    if (errors.name.length || errors.description.length || errors.key.length) {
      return { success: false, errors }
    }

    await prismadb.role.update({ where: { id }, data: { name, description, key } })

    revalidatePath(`/admin/roles/`)

    return { success: true }
  } catch (error) {
    return { success: false }
  }
}
