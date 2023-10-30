"use server"

import { getServerAuthSession } from "@/lib/auth"
import { DataResult } from "@/types/types"
import prismadb from "@/utils/prismadb"

interface IPermission {
  name: string
  description: string
}

export async function createPermission({
  name,
  description,
}: IPermission): Promise<DataResult<IPermission>> {
  try {
    const session = await getServerAuthSession()
    const errors: { name: string[]; description: string[] } = {
      name: [],
      description: [],
    }
    const permissionAlreadyExists = await prismadb.permission.findUnique({
      where: { name },
    })
    if (permissionAlreadyExists) {
      errors.name.push(`A permission with the name ${name} already exists.`)
    }

    if (errors.name.length || errors.description.length) {
      return { success: false, errors }
    }

    await prismadb.permission.create({
      data: { name, description },
    })
    return { success: true }
  } catch (error) {
    return { success: false }
  }
}
