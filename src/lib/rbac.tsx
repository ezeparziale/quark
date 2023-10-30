import { redirect } from "next/navigation"

import { getCurrentUser } from "@/actions/get-current-user"
import prismadb from "@/utils/prismadb"

async function hasRequiredPermissions(requiredPermissions: string[]): Promise<boolean> {
  const user = await getCurrentUser()
  if (user) {
    const userRoles = await prismadb.userRole.findMany({
      where: { userId: user.id },
      include: {
        role: { include: { permissions: { include: { permission: true } } } },
      },
    })
    return userRoles.some((userRole) => {
      return requiredPermissions.some((permission) => {
        return userRole.role.permissions.some(
          (rolePermission) => rolePermission.permission.name === permission,
        )
      })
    })
  }
  return false
}

export function withRoles(Component: any, requiredPermissions: string[]) {
  return async function WithRolesWrapper(props: any) {
    const hasPermission = await hasRequiredPermissions(requiredPermissions)
    if (hasPermission) {
      return <Component {...props} />
    } else {
      redirect("/auth/error/?error=AccessUnauthorized")
    }
  }
}
