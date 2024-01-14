"use server"

import { revalidatePath } from "next/cache"

import { DataResult } from "@/types/types"
import prismadb from "@/utils/prismadb"

interface IUser {
  id: string
  username: string
  email: string
  active: boolean
  confirmedEmail: boolean
}

export async function updateUser({
  id,
  username,
  email,
  active,
  confirmedEmail,
}: IUser): Promise<DataResult<IUser>> {
  try {
    const errors: { email: string[]; username: string[] } = {
      email: [],
      username: [],
    }
    const emailAlreadyExists = await prismadb.user.findUnique({
      where: { email, NOT: { id } },
    })
    if (emailAlreadyExists) {
      errors.email.push(`An account with the email ${email} already exists.`)
    }

    const usenameAlreadyExists = await prismadb.user.findUnique({
      where: { username, NOT: { id } },
    })
    if (usenameAlreadyExists) {
      errors.username.push("Username already exists.")
    }

    if (errors.email.length || errors.username.length) {
      return { success: false, errors }
    }

    await prismadb.user.update({
      where: { id },
      data: { username, email, active, confirmedEmail },
    })

    revalidatePath(`/admin/users/${id}`)

    return { success: true }
  } catch (error) {
    return { success: false }
  }
}
