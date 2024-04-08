"use server"

import { redirect } from "next/navigation"

import prismadb from "@/lib/prismadb"
import { validateSchemaAction } from "@/lib/validate-schema-action"
import { feedbackSchema } from "@/schemas/feedbacks"
import { DataResult } from "@/types/types"
import * as z from "zod"

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

    return { success: true }
  } catch (error) {
    console.error("Error creating feedback:", error)
    return { success: false, message: "Something went wrong" }
  }
}

export const addFeedback = validateSchemaAction(feedbackSchema, handler)
