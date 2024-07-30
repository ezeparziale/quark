"use server"

import { revalidatePath } from "next/cache"

import { auth } from "@/auth"
import * as z from "zod"

import { DataResult } from "@/types/types"

import { createTokenApi } from "@/lib/auth"
import prismadb from "@/lib/prismadb"
import { has } from "@/lib/rbac"
import { validateSchemaAction } from "@/lib/validate-schema-action"

import { tokenCreateServerActionSchema } from "@/schemas/tokens"

type FormData = z.infer<typeof tokenCreateServerActionSchema>

async function handler(formData: FormData): Promise<DataResult<FormData>> {
  try {
    const isAuthorized = await has({ role: "admin" })

    if (!isAuthorized) {
      return { success: false, message: "Unauthorized" }
    }

    const session = await auth()

    const { name } = formData

    const { token, hashedToken, partialToken } = await createTokenApi()

    await prismadb.token.create({
      data: { name, hashedToken, partialToken, userId: session?.user.userId! },
    })

    revalidatePath(`/admin/tokens/`)

    return { success: true, data: { token } }
  } catch (error) {
    console.error("Error creating token:", error)
    return { success: false, message: "Something went wrong" }
  }
}

export const createToken = validateSchemaAction(tokenCreateServerActionSchema, handler)
