import "server-only"

import prismadb from "@/lib/prismadb"

export const getToolById = async (id: number) => {
  try {
    const tool = await prismadb.tool.findUnique({ where: { id } })

    return tool
  } catch {
    return null
  }
}
