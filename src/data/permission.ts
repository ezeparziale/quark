import prismadb from "@/lib/prismadb"

export const getPermissionById = async (id: number) => {
  try {
    const permission = await prismadb.permission.findUnique({ where: { id } })

    return permission
  } catch {
    return null
  }
}
