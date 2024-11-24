"use server"

import { revalidatePath } from "next/cache"

import { z } from "zod"

import { DataResult } from "@/types/types"

import prismadb from "@/lib/prismadb"
import { has } from "@/lib/rbac"
import { validateSchemaAction } from "@/lib/validate-schema-action"

import { permissionServerActionSchema } from "@/schemas/permissions"

type FormData = z.infer<typeof permissionServerActionSchema>

async function handler(formData: FormData): Promise<DataResult<FormData>> {
  const { id, name, description, key, isActive } = formData

  try {
    const isAuthorized = await has({ role: "admin" })

    if (!isAuthorized) {
      return { success: false, message: "Unauthorized" }
    }

    const errors: Record<string, string[]> = { name: [], key: [], description: [] }

    const permissionAlreadyExist = await prismadb.permission.findMany({
      where: {
        OR: [{ name }, { key }],
        NOT: { id },
      },
    })
    if (permissionAlreadyExist.length > 0) {
      permissionAlreadyExist.forEach((permission) => {
        if (permission.name === name) {
          errors.name.push(`A permission with the name '${name}' already exists.`)
        }
        if (permission.key === key) {
          errors.key.push(`A permission with the key '${key}' already exists.`)
        }
      })
    }

    if (Object.values(errors).some((errorArray) => errorArray.length > 0)) {
      return { success: false, errors }
    }

    await prismadb.permission.update({
      where: { id },
      data: { name, description, key, isActive },
    })

    revalidatePath(`/admin/permissions/${id}`)
    revalidatePath(`/admin/permissions/`)

    return { success: true }
  } catch (error) {
    console.error("Error updating permission:", error)
    return { success: false, message: "Something went wrong" }
  }
}

export const updatePermission = validateSchemaAction(
  permissionServerActionSchema,
  handler,
)
