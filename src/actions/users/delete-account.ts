"use server"

import { auth } from "@/auth"

import { DataResult } from "@/types/types"

import { logActivity } from "@/lib/activity"
import prismadb from "@/lib/prismadb"

import { ActivityType } from "@/schemas/activity-logs"

type FormDataDeleteAccount = {
  userEmail: string
  confirmString: string
}

export async function deleteAccount({
  userEmail,
  confirmString,
}: FormDataDeleteAccount): Promise<DataResult<FormDataDeleteAccount>> {
  const session = await auth()
  const errors: { userEmail: string[]; confirmString: string[] } = {
    userEmail: [],
    confirmString: [],
  }
  try {
    const email = session?.user.email

    if (confirmString != "delete my account") {
      errors.confirmString.push("Please type 'delete my account'")
    }

    if (email) {
      const user = await prismadb.user.findUnique({ where: { email } })

      if (user) {
        if (user.email === userEmail) {
          await prismadb.user.delete({
            where: {
              id: user.id,
            },
          })
          await logActivity(session.user.userId, ActivityType.DELETE_ACCOUNT)
          return { success: true }
        } else {
          errors.userEmail.push("Wrong email")
        }
      }
    }

    return { success: false, errors: errors }
  } catch {
    return { success: false }
  }
}
