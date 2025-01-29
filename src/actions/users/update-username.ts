"use server"

import { auth } from "@/auth"

import { DataResult } from "@/types/types"

import { logActivity } from "@/lib/activity"
import prismadb from "@/lib/prismadb"

import { ActivityType } from "@/schemas/activity-logs"

type FormDataUsername = {
  username: string
}

const THIRTY_DAYS = 30

export async function updateUsername({
  username,
}: FormDataUsername): Promise<DataResult<FormDataUsername>> {
  const session = await auth()
  try {
    const email = session?.user.email

    if (email) {
      const user = await prismadb.user.findUnique({ where: { email } })

      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - THIRTY_DAYS)

      if (user) {
        if (!user.usernameUpdatedAt || user.usernameUpdatedAt < thirtyDaysAgo) {
          const usernameExists = await prismadb.user.findMany({
            where: {
              username,
              email: {
                not: email,
              },
            },
          })
          if (usernameExists.length === 0) {
            await prismadb.user.update({
              where: { id: user.id },
              data: {
                username,
                usernameUpdatedAt: new Date(),
              },
            })

            await logActivity(session?.user.userId!, ActivityType.UPDATE_USERNAME)

            return { success: true }
          } else {
            return { success: false, errors: { username: ["Username already exists"] } }
          }
        } else {
          return {
            success: false,
            errors: {
              username: ["It hasn't been 30 days since the last username update"],
            },
          }
        }
      }
    }
    return { success: false }
  } catch {
    return { success: false }
  }
}
