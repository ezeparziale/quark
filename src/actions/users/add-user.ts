"use server"

import { getServerAuthSession } from "@/lib/auth"
import { DataResult } from "@/types/types"
import prismadb from "@/utils/prismadb"

interface IUser {
  username: string
  email: string
  active: boolean
  confirmedEmail: boolean
}

export async function addUser({
  username,
  email,
  active,
  confirmedEmail,
}: IUser): Promise<DataResult<IUser>> {
  try {
    const session = await getServerAuthSession()
    const errors: { email: string[]; username: string[] } = {
      email: [],
      username: [],
    }
    const emailAlreadyExists = await prismadb.user.findUnique({
      where: { email },
    })
    if (emailAlreadyExists) {
      errors.email.push(`An account with the email ${email} already exists.`)
    }

    const usenameAlreadyExists = await prismadb.user.findUnique({
      where: { username },
    })
    if (usenameAlreadyExists) {
      errors.username.push("Username already exists.")
    }

    if (errors.email.length || errors.username.length) {
      return { success: false, errors }
    }

    await prismadb.user.create({
      data: { username, email, active, confirmedEmail, hashedPassword: "" },
    })
    return { success: true }
  } catch (error) {
    return { success: false }
  }
}
