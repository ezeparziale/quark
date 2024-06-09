"server only"

import prismadb from "@/lib/prismadb"

export const getPermissionById = async (id: number) => {
  try {
    const permission = await prismadb.permission.findUnique({ where: { id } })

    return permission
  } catch {
    return null
  }
}

export const getAllPermissions = async () => {
  try {
    const permissions = await prismadb.permission.findMany({
      orderBy: { updatedAt: "desc" },
    })

    return permissions
  } catch (error) {
    console.error(error)
    return []
  }
}
