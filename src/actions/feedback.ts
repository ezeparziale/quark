"use server"

import { redirect } from "next/navigation"

import * as z from "zod"

import { DataResult } from "@/types/types"

import { logActivity } from "@/lib/activity"
import prismadb from "@/lib/prismadb"
import { validateSchemaAction } from "@/lib/validate-schema-action"

import { ActivityType } from "@/schemas/activity-logs"
import { feedbackSchema } from "@/schemas/feedbacks"

import { getCurrentUser } from "./users/get-current-user"

type FormData = z.infer<typeof feedbackSchema>

async function handler(formData: FormData): Promise<DataResult<FormData>> {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/auth/error")
  }
  try {
    const feedback = formData.feedback

    const nps = formData.nps ? parseInt(formData.nps) : undefined

    await prismadb.feedback.create({ data: { feedback, nps, userId: currentUser.id } })

    await logActivity(currentUser.id, ActivityType.SEND_FEEDBACK)

    return { success: true }
  } catch (error) {
    console.error("Error creating feedback:", error)
    return { success: false, message: "Something went wrong" }
  }
}

export const addFeedback = validateSchemaAction(feedbackSchema, handler)
