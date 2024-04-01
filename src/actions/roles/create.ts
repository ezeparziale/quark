"use server"

import { revalidatePath } from "next/cache"

import prismadb from "@/lib/prismadb"
import { has } from "@/lib/rbac"
import { validateSchemaAction } from "@/lib/validate-schema-action"
import { rolesSchema } from "@/schemas/roles"
import { DataResult } from "@/types/types"
import * as z from "zod"

type FormData = z.infer<typeof rolesSchema>

async function handler(formData: FormData): Promise<DataResult<FormData>> {
  const { name, description, key } = formData

  try {
    const isAuthorized = await has({ role: "admin" })

    if (!isAuthorized) {
      return { success: false, message: "Unauthorized" }
    }

    const errors: Record<string, string[]> = { name: [], key: [], description: [] }

    const roleAlreadyExist = await prismadb.role.findFirst({
      where: {
        OR: [{ name }, { key }],
      },
    })

    if (roleAlreadyExist) {
      if (roleAlreadyExist.name === name) {
        errors.name.push(`A role with the name '${name}' already exists.`)
      }
      if (roleAlreadyExist.key === key) {
        errors.key.push(`A role with the key '${key}' already exists.`)
      }
    }

    if (Object.values(errors).some((errorArray) => errorArray.length > 0)) {
      return { success: false, errors }
    }

    await prismadb.role.create({
      data: { name, description, key },
    })

    revalidatePath(`/admin/roles/`)

    return { success: true }
  } catch (error) {
    console.error("Error creating role:", error)
    return { success: false, message: "Something went wrong" }
  }
}

export const createRole = validateSchemaAction(rolesSchema, handler)
