"use server"

import { revalidatePath } from "next/cache"

import * as z from "zod"

import { DataResult } from "@/types/types"

import prismadb from "@/lib/prismadb"
import { has } from "@/lib/rbac"
import { validateSchemaAction } from "@/lib/validate-schema-action"

import { roleServerActionUpdateSchema } from "@/schemas/roles"

type FormData = z.infer<typeof roleServerActionUpdateSchema>

async function handler(formData: FormData): Promise<DataResult<FormData>> {
  const { id, name, description, key } = formData

  try {
    const isAuthorized = await has({ role: "admin" })

    if (!isAuthorized) {
      return { success: false, message: "Unauthorized" }
    }

    const errors: Record<string, string[]> = { name: [], key: [], description: [] }

    const roleAlreadyExist = await prismadb.role.findMany({
      where: {
        OR: [{ name }, { key }],
        NOT: { id },
      },
    })

    if (roleAlreadyExist.length > 0) {
      roleAlreadyExist.forEach((role) => {
        if (role.name === name) {
          errors.name.push(`A role with the name '${name}' already exists.`)
        }
        if (role.key === key) {
          errors.key.push(`A role with the key '${key}' already exists.`)
        }
      })
    }

    if (Object.values(errors).some((errorArray) => errorArray.length > 0)) {
      return { success: false, errors }
    }

    await prismadb.role.update({ where: { id }, data: { name, description, key } })

    revalidatePath(`/admin/roles/${id}`)
    revalidatePath(`/admin/roles/`)

    return { success: true }
  } catch (error) {
    console.error("Error updating role:", error)
    return { success: false, message: "Something went wrong" }
  }
}

export const updateRole = validateSchemaAction(roleServerActionUpdateSchema, handler)
