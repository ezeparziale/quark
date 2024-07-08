"server only"

import prismadb from "@/lib/prismadb"

import { Option } from "@/components/ui/multiple-selector"

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

export const getPermissionOptions = async (search?: string) => {
  try {
    const permissions = await prismadb.permission.findMany({
      where: { name: { contains: search, mode: "insensitive" } },
      skip: 0,
      take: 10,
      orderBy: { name: "asc" },
    })

    const options: Option[] = permissions.map((permission) => ({
      value: permission.id.toString(),
      label: permission.name,
    }))

    return options
  } catch (error) {
    console.error(error)
    return []
  }
}
