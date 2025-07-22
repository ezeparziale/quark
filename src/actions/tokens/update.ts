"use server"

import { revalidatePath } from "next/cache"

import * as z from "zod"

import { DataResult } from "@/types/types"

import prismadb from "@/lib/prismadb"
import { has } from "@/lib/rbac"
import { validateSchemaAction } from "@/lib/validate-schema-action"

import { tokenUpdateServerActionSchema } from "@/schemas/tokens"

type FormData = z.infer<typeof tokenUpdateServerActionSchema>

async function handler(formData: FormData): Promise<DataResult<FormData>> {
  try {
    const isAuthorized = await has({ role: "admin" })

    if (!isAuthorized) {
      return { success: false, message: "Unauthorized" }
    }

    const { id, name, isActive } = formData

    await prismadb.token.update({
      where: { id },
      data: {
        name,
        isActive,
      },
    })

    revalidatePath(`/admin/tokens/`)

    return { success: true }
  } catch (error) {
    console.error("Error editing token:", error)
    return { success: false, message: "Something went wrong" }
  }
}

export const updateToken = validateSchemaAction(tokenUpdateServerActionSchema, handler)
