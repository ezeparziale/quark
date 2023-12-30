"use server"

import { revalidatePath } from "next/cache"

import { DataResult } from "@/types/types"
import prismadb from "@/utils/prismadb"

interface IRole {
  id: number
  name: string
  description: string
}

export async function updateRole({
  id,
  name,
  description,
}: IRole): Promise<DataResult<IRole>> {
  try {
    const errors: { name: string[]; description: string[] } = {
      name: [],
      description: [],
    }
    const roleAlreadyExists = await prismadb.role.findUnique({
      where: { name, NOT: { id } },
    })
    if (roleAlreadyExists) {
      errors.name.push(`A role with the name ${name} already exists.`)
    }

    if (errors.name.length || errors.description.length) {
      return { success: false, errors }
    }

    await prismadb.role.update({ where: { id }, data: { name, description } })

    revalidatePath(`/admin/roles/`)

    return { success: true }
  } catch (error) {
    return { success: false }
  }
}
