"use server"

import { revalidatePath } from "next/cache"

import type { Permission } from "@prisma/client"

import prismadb from "@/lib/prismadb"
import { has } from "@/lib/rbac"

export async function deletePermission(permission: Permission) {
  try {
    const isAuthorized = await has({ role: "admin" })

    if (!isAuthorized) {
      return { success: false, message: "Unauthorized" }
    }

    await prismadb.permission.delete({ where: { id: permission.id } })

    revalidatePath(`/admin/permissions/`)

    return { success: true }
  } catch (error) {
    console.error("Error deleting permission:", error)
    return { success: false, message: "Something went wrong" }
  }
}
