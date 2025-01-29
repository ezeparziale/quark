"use server"

import { revalidatePath } from "next/cache"

import { auth } from "@/auth"

import { logActivity } from "@/lib/activity"
import prismadb from "@/lib/prismadb"
import { has } from "@/lib/rbac"

import { ActivityType } from "@/schemas/activity-logs"

interface IDeleteRoleUser {
  roleId: number
  userId: number
}

export async function removeRolToUser({ roleId, userId }: IDeleteRoleUser) {
  try {
    const session = await auth()

    const isAuthorized = await has({ role: "admin" })

    if (!isAuthorized) {
      return { success: false, message: "Unauthorized" }
    }

    await prismadb.userRole.deleteMany({
      where: { roleId, userId },
    })

    revalidatePath(`/admin/users/${userId}/roles`)

    await logActivity(session?.user.userId!, ActivityType.REMOVE_ROLE)

    return { success: true }
  } catch (error) {
    console.error("Error removing role:", error)
    return { success: false, message: "Something went wrong" }
  }
}
