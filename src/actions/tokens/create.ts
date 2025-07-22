"use server"

import { revalidatePath } from "next/cache"

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

    const { name, userId, type, permissionIds } = formData

    const { token, hashedToken, partialToken } = await createTokenApi()

    if (type === "custom" && permissionIds && permissionIds.length > 0) {
      await prismadb.token.create({
        data: {
          name,
          hashedToken,
          partialToken,
          userId,
          type,
          permissions: {
            create: permissionIds.map((id: number) => ({
              permission: { connect: { id } },
              assignedBy: "user", // You might want to replace this with the current user's ID
            })),
          },
        },
      })
    } else {
      await prismadb.token.create({
        data: { name, hashedToken, partialToken, userId, type: "inherit" },
      })
    }

    revalidatePath(`/admin/tokens/`)

    return { success: true, data: { token } }
  } catch (error) {
    console.error("Error creating token:", error)
    return { success: false, message: "Something went wrong" }
  }
}

export const createToken = validateSchemaAction(tokenCreateServerActionSchema, handler)
