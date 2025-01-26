import { redirect } from "next/navigation"

import { Suspense } from "react"

import { auth } from "@/auth"

import { logActivity } from "@/lib/activity"

import { ActivityType } from "@/schemas/activity-logs"

import { Logout } from "./logout"

export default async function LogoutPage() {
  const session = await auth()

  if (!session) {
    redirect("/auth/login")
  }

  await logActivity(session.user.userId, ActivityType.SIGN_OUT)

  return (
    <Suspense>
      <Logout />
    </Suspense>
  )
}
