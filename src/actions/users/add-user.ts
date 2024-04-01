"use server"

import { revalidatePath } from "next/cache"

import prismadb from "@/lib/prismadb"
import { has } from "@/lib/rbac"
import { validateSchemaAction } from "@/lib/validate-schema-action"
import { userSchema } from "@/schemas/users"
import { DataResult } from "@/types/types"
import * as z from "zod"

type FormData = z.infer<typeof userSchema>

async function handler(formData: FormData): Promise<DataResult<FormData>> {
  const { email, username, active, confirmedEmail } = formData

  try {
    const isAuthorized = await has({ role: "admin" })

    if (!isAuthorized) {
      return { success: false, message: "Unauthorized" }
    }

    const errors: Record<string, string[]> = { email: [], username: [] }

    const userAlreadyExist = await prismadb.user.findMany({
      where: {
        OR: [{ email }, { username }],
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

    await prismadb.user.create({
      data: { username, email, active, confirmedEmail },
    })

    revalidatePath(`/admin/users`)

    return { success: true }
  } catch (error) {
    console.error("Error creating user:", error)
    return { success: false, message: "Something went wrong" }
  }
}

export const addUser = validateSchemaAction(userSchema, handler)
