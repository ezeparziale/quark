"use server"

import { revalidatePath } from "next/cache"

import { z } from "zod"

import { DataResult } from "@/types/types"

import prismadb from "@/lib/prismadb"
import { has } from "@/lib/rbac"
import { validateSchemaAction } from "@/lib/validate-schema-action"

import { userEditServerActionSchema } from "@/schemas/users"

type FormData = z.infer<typeof userEditServerActionSchema>

async function handler(formData: FormData): Promise<DataResult<FormData>> {
  const { id, email, username, isActive, emailVerified, isAdmin } = formData

  try {
    const isAuthorized = await has({ role: "admin" })

    if (!isAuthorized) {
      return { success: false, message: "Unauthorized" }
    }

    const errors: Record<string, string[]> = { email: [], username: [] }

    const userAlreadyExist = await prismadb.user.findMany({
      where: {
        OR: [{ email }, { username }],
        NOT: { id },
      },
    })

    if (userAlreadyExist.length > 0) {
      userAlreadyExist.forEach((user) => {
        if (user.email === email) {
          errors.email.push(`An account with the email '${email}' already exists.`)
        }
        if (user.username === username) {
          errors.username.push(`Username '${username}' already exists.`)
        }
      })
    }

    if (Object.values(errors).some((errorArray) => errorArray.length > 0)) {
      return { success: false, errors }
    }

    await prismadb.user.update({
      where: { id },
      data: { username, email, isActive, emailVerified, isAdmin },
    })

    revalidatePath(`/admin/users/${id}`)
    revalidatePath(`/admin/users`)

    return { success: true }
  } catch (error) {
    console.error("Error updating user:", error)
    return { success: false, message: "Something went wrong" }
  }
}

export const updateUser = validateSchemaAction(userEditServerActionSchema, handler)
