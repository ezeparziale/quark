"use server"

import { revalidatePath } from "next/cache"

import { getServerAuthSession } from "@/lib/auth"
import prismadb from "@/lib/prismadb"
import { DataResult } from "@/types/types"

interface IPermission {
  name: string
  description: string
  key: string
}

export async function createPermission({
  name,
  description,
  key,
}: IPermission): Promise<DataResult<IPermission>> {
  try {
    const session = await getServerAuthSession()
    const errors: { name: string[]; description: string[]; key: string[] } = {
      name: [],
      description: [],
      key: [],
    }
    const permissionAlreadyExists = await prismadb.permission.findUnique({
      where: { name },
    })
    if (permissionAlreadyExists) {
      errors.name.push(`A permission with the name '${name}' already exists.`)
    }

    const permissionKeyAlreadyExists = await prismadb.permission.findUnique({
      where: { key },
    })
    if (permissionKeyAlreadyExists) {
      errors.key.push(`A permission with the key '${key}' already exists.`)
    }

    if (errors.name.length || errors.description.length || errors.key.length) {
      return { success: false, errors }
    }

    await prismadb.permission.create({
      data: { name, description, key },
    })

    revalidatePath(`/admin/permissions/`)

    return { success: true }
  } catch (error) {
    return { success: false }
  }
}
