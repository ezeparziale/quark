"use server"

import { revalidatePath } from "next/cache"

import prismadb from "@/lib/prismadb"
import * as z from "zod"

import { getCurrentUser } from "./get-current-user"

const schema = z.object({
  toolId: z.number(),
})

export async function AddToolFavorite(prevState: any, formData: FormData) {
  const currentUser = await getCurrentUser()

  const data = schema.parse({ toolId: Number(formData.get("id")) })

  if (currentUser) {
    try {
      await prismadb.userToolFavorites.create({
        data: { toolId: data.toolId, userId: currentUser.id },
      })
      revalidatePath("/tools")
      return { success: true, message: "Tool added to favorites!" }
    } catch (e) {
      return {
        success: false,
        message: "Failed to add tool to favorites. Please try again.",
      }
    }
  }
}

export async function RemoveToolFavorite(prevState: any, formData: FormData) {
  const currentUser = await getCurrentUser()

  const data = schema.parse({ toolId: Number(formData.get("id")) })

  if (currentUser) {
    try {
      await prismadb.userToolFavorites.deleteMany({
        where: { toolId: data.toolId, userId: currentUser.id },
      })
      revalidatePath("/tools")
      return { success: true, message: "Tool removed from favorites!" }
    } catch (e) {
      return {
        success: false,
        message: "Failed to remove tool from favorites. Please try again.",
      }
    }
  }
}
