"use server"

import { revalidatePath } from "next/cache"

import prismadb from "@/lib/prismadb"
import { has } from "@/lib/rbac"
import { DataResult } from "@/types/types"

interface Props {
  roleId: number
  toolsIds?: number[] | undefined
}

export async function addToolsToRoles({
  roleId,
  toolsIds,
}: Props): Promise<DataResult<Props>> {
  try {
    const isAuthorized = await has({ role: "admin" })

    if (!isAuthorized) {
      return { success: false, message: "Unauthorized" }
    }

    const currentTools = await prismadb.roleTool.findMany({
      where: { roleId },
      select: { toolId: true },
    })

    const currentToolIds = new Set(currentTools.map((tool) => tool.toolId))
    const newToolIds = new Set(toolsIds?.map((toolId) => toolId) || [])
    const toolsToDelete = currentTools.filter((tool) => !newToolIds.has(tool.toolId))
    const toolsToAdd = toolsIds?.filter((toolId) => !currentToolIds.has(toolId)) || []
    const dataToInsert = toolsToAdd.map((toolId) => ({
      roleId: roleId,
      toolId: toolId,
    }))

    await prismadb.roleTool.deleteMany({
      where: {
        roleId,
        toolId: {
          in: toolsToDelete.map((tool) => tool.toolId),
        },
      },
    })

    await prismadb.roleTool.createMany({ data: dataToInsert })

    revalidatePath(`/admin/roles/${roleId}/tools`)

    return { success: true }
  } catch (error) {
    console.error("Error adding tools to role:", error)
    return { success: false, message: "Something went wrong" }
  }
}
