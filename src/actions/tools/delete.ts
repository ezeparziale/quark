"use server"

import { revalidatePath } from "next/cache"

import type { Tool } from "@prisma/client"

import prismadb from "@/lib/prismadb"
import { has } from "@/lib/rbac"

export async function deleteTool(tool: Tool) {
  try {
    const isAuthorized = await has({ role: "admin" })

    if (!isAuthorized) {
      return { success: false, message: "Unauthorized" }
    }

    await prismadb.tool.delete({ where: { id: tool.id } })

    revalidatePath(`/admin/tools/`)

    return { success: true }
  } catch (error) {
    console.error("Error deleting tool:", error)
    return { success: false, message: "Something went wrong" }
  }
}
