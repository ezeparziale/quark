"use server"

import { auth } from "@/auth"
import { hash } from "bcrypt"

import { logActivity } from "@/lib/activity"
import prismadb from "@/lib/prismadb"
import { has } from "@/lib/rbac"

import { ActivityType } from "@/schemas/activity-logs"

export async function checkUserPassword(userId: number): Promise<boolean> {
  try {
    const isAuthorized = await has({ role: "admin" })

    if (!isAuthorized) {
      throw new Error(
        "Unauthorized: You do not have permission to perform this action.",
      )
    }
    const user = await prismadb.user.findUnique({
      where: { id: userId },
      select: { password: true },
    })
    return !!user?.password
  } catch (error) {
    console.error("Authorization error:", error)
    throw new Error("Failed to authorize user for password reset.")
  }
}

export async function resetUserPassword(userId: number): Promise<void> {
  try {
    const session = await auth()

    const isAuthorized = await has({ role: "admin" })

    if (!isAuthorized) {
      throw new Error(
        "Unauthorized: You do not have permission to perform this action.",
      )
    }

    await prismadb.user.update({
      where: { id: userId },
      data: { password: null },
    })
    await logActivity(session?.user.userId!, ActivityType.RESET_PASSWORD)
  } catch (error) {
    console.error("Error resetting password:", error)
    throw new Error("Failed to reset password.")
  }
}

export async function setTemporaryPassword(
  userId: number,
  temporaryPassword: string,
): Promise<void> {
  try {
    const session = await auth()

    const isAuthorized = await has({ role: "admin" })

    if (!isAuthorized) {
      throw new Error(
        "Unauthorized: You do not have permission to perform this action.",
      )
    }

    const hashedPassword = await hash(temporaryPassword, 12)
    await prismadb.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    })
    await logActivity(session?.user.userId!, ActivityType.SET_TEMPORARY_PASSWORD)
  } catch (error) {
    console.error("Error setting temporary password:", error)
    throw new Error("Failed to set temporary password.")
  }
}
