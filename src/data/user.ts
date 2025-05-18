import "server-only"

import prismadb from "@/lib/prismadb"

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prismadb.user.findUnique({ where: { email } })

    return user
  } catch {
    return null
  }
}

export const getUserById = async (id: number) => {
  try {
    const user = await prismadb.user.findUnique({ where: { id } })

    return user
  } catch {
    return null
  }
}

export const getUserByUsername = async (username: string) => {
  try {
    const user = await prismadb.user.findUnique({ where: { username } })

    return user
  } catch {
    return null
  }
}

export const getUserTools = async (userId: number, search?: string) => {
  try {
    const data = await prismadb.user.findUnique({
      where: { id: userId },
      select: {
        roles: {
          select: {
            role: {
              select: {
                tools: {
                  select: {
                    tool: { select: { id: true, name: true, href: true, icon: true } },
                  },
                },
              },
            },
          },
        },
        toolsFavorites: true,
      },
    })

    if (!data) return null

    const favoritesToolIds = data?.toolsFavorites.map((tool) => tool.toolId)

    const flatTools = data?.roles.map((role) =>
      role.role.tools.map((tool) => tool.tool),
    )

    const toolsData = flatTools
      ?.flat()
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((tool) => ({ ...tool, isFavorite: favoritesToolIds.includes(tool.id) }))

    if (search) {
      const filteredData = toolsData?.filter((tool) =>
        tool.name.toLowerCase().includes(search.toLowerCase()),
      )
      return filteredData
    }

    return toolsData
  } catch {
    return null
  }
}

export const getUsers = async () => {
  try {
    const users = await prismadb.user.findMany({
      omit: {
        password: true,
        usernameUpdatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
    })
    const now = new Date()
    const seconds = now.getSeconds()

    if (seconds < 30) {
      throw new Error(`Failed to fetch users`)
    }
    return users
  } catch (error) {
    console.error("Failed to fetch users:", error)
    throw error
  }
}
