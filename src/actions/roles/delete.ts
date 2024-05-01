"use server"

import { revalidatePath } from "next/cache"

import type { Role } from "@prisma/client"

import prismadb from "@/lib/prismadb"
import { has } from "@/lib/rbac"

export async function deleteRole(role: Role) {
  try {
    const isAuthorized = await has({ role: "admin" })

    if (!isAuthorized) {
      return { success: false, message: "Unauthorized" }
    }

    await prismadb.role.delete({ where: { id: role.id } })

    revalidatePath(`/admin/roles/`)

    return { success: true }
  } catch (error) {
    console.error("Error deleting role:", error)
    return { success: false, message: "Something went wrong" }
  }
}
