"use server"

import { revalidatePath } from "next/cache"

import { auth } from "@/auth"

import { logActivity } from "@/lib/activity"
import prismadb from "@/lib/prismadb"
import { has } from "@/lib/rbac"

import { ActivityType } from "@/schemas/activity-logs"

export async function deleteUser(id: number) {
  try {
    const session = await auth()

    const isAuthorized = await has({ role: "admin" })

    if (!isAuthorized) {
      return { success: false, message: "Unauthorized" }
    }

    await prismadb.user.delete({ where: { id } })

    revalidatePath(`/admin/users`)

    await logActivity(session?.user.userId!, ActivityType.DELETE_USER)

    return { success: true }
  } catch {
    return { success: false, message: "Something went wrong" }
  }
}
