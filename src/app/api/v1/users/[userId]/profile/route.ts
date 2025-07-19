import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"

import { ZodError } from "zod"

import { logActivity } from "@/lib/activity"
import { ApiError, getIdInputOrThrow, parseRequestBody } from "@/lib/api"
import { withAdmin } from "@/lib/auth"
import prismadb from "@/lib/prismadb"

import { ActivityType } from "@/schemas/activity-logs"
import { userUpdateProfileSchema } from "@/schemas/users"

export const PUT = withAdmin(async ({ req, context, currentUser }) => {
  try {
    const { userId } = context.params
    const id: number = getIdInputOrThrow(userId)

    const bodyRaw = await parseRequestBody(req)
    const {
      firstName,
      lastName,
      bio,
      phone,
      websiteUrl,
      linkedinUrl,
      githubUrl,
      jobTitle,
      department,
    } = userUpdateProfileSchema.parse(bodyRaw)

    console.log(`Saving profile for user ${id}`)

    const toNull = (value: unknown) => (value === undefined ? null : value)

    const dataToUpdate = {
      firstName: toNull(firstName),
      lastName: toNull(lastName),
      bio: toNull(bio),
      phone: toNull(phone),
      websiteUrl: toNull(websiteUrl),
      linkedinUrl: toNull(linkedinUrl),
      githubUrl: toNull(githubUrl),
      jobTitle: toNull(jobTitle),
      department: toNull(department),
    }

    await prismadb.user.update({
      where: { id },
      data: dataToUpdate,
    })

    revalidatePath(`/admin/user/${id}/profile`)

    await logActivity(currentUser.id, ActivityType.UPDATE_USER_PROFILE)

    return NextResponse.json({ success: true, message: "Profile saved successfully" })
  } catch (error) {
    console.error("Error:", error)
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.code })
    }
    if (error instanceof ZodError) {
      const errorsValidation = error.flatten().fieldErrors
      return NextResponse.json({ errors: errorsValidation }, { status: 422 })
    }
    return NextResponse.json(
      { success: false, message: "Failed to save profile" },
      { status: 500 },
    )
  }
})
