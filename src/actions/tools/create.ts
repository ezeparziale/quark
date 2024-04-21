"use server"

import { revalidatePath } from "next/cache"

import prismadb from "@/lib/prismadb"
import { has } from "@/lib/rbac"
import { validateSchemaAction } from "@/lib/validate-schema-action"
import { toolSchema } from "@/schemas/tools"
import { DataResult } from "@/types/types"
import * as z from "zod"

type FormData = z.infer<typeof toolSchema>

async function handler(formData: FormData): Promise<DataResult<FormData>> {
  const { name, description, href, icon } = formData

  try {
    const isAuthorized = await has({ role: "admin" })

    if (!isAuthorized) {
      return { success: false, message: "Unauthorized" }
    }

    const errors: Record<string, string[]> = {
      name: [],
      description: [],
      href: [],
      icon: [],
    }

    const toolAlreadyExist = await prismadb.tool.findFirst({
      where: {
        OR: [{ name }],
      },
    })

    if (toolAlreadyExist) {
      if (toolAlreadyExist.name === name) {
        errors.name.push(`A tool with the name '${name}' already exists.`)
      }
    }

    if (Object.values(errors).some((errorArray) => errorArray.length > 0)) {
      return { success: false, errors }
    }

    await prismadb.tool.create({
      data: { name, description, href, icon },
    })

    revalidatePath(`/admin/tools/`)

    return { success: true }
  } catch (error) {
    console.error("Error creating tool:", error)
    return { success: false, message: "Something went wrong" }
  }
}

export const createTool = validateSchemaAction(toolSchema, handler)
