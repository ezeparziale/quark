"use server"

import { revalidatePath } from "next/cache"

import prismadb from "@/lib/prismadb"
import { has } from "@/lib/rbac"
import { validateSchemaAction } from "@/lib/validate-schema-action"
import { permissionSchema } from "@/schemas/permissions"
import { DataResult } from "@/types/types"
import * as z from "zod"

type FormData = z.infer<typeof permissionSchema>

async function handler(formData: FormData): Promise<DataResult<FormData>> {
  const { name, description, key } = formData

  try {
    const isAuthorized = await has({ role: "admin" })

    if (!isAuthorized) {
      return { success: false, message: "Unauthorized" }
    }

    const errors: Record<string, string[]> = { name: [], key: [], description: [] }

    const permissionAlreadyExist = await prismadb.permission.findFirst({
      where: {
        OR: [{ name }, { key }],
      },
    })

    if (permissionAlreadyExist) {
      if (permissionAlreadyExist.name === name) {
        errors.name.push(`A permission with the name '${name}' already exists.`)
      }
      if (permissionAlreadyExist.key === key) {
        errors.key.push(`A permission with the key '${key}' already exists.`)
      }
    }

    if (Object.values(errors).some((errorArray) => errorArray.length > 0)) {
      return { success: false, errors }
    }

    await prismadb.permission.create({
      data: { name, description, key },
    })

    revalidatePath(`/admin/permissions/`)

    return { success: true }
  } catch (error) {
    console.error("Error creating permission:", error)
    return { success: false, message: "Something went wrong" }
  }
}

export const createPermission = validateSchemaAction(permissionSchema, handler)
