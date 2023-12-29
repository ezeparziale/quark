"use server"

import { redirect } from "next/navigation"

import { getCurrentUser } from "@/actions/users/get-current-user"
import prismadb from "@/utils/prismadb"

async function getUserRoles(userId: string) {
  const userRoles = await prismadb.userRole.findMany({
    where: { userId },
    include: {
      role: { include: { permissions: { include: { permission: true } } } },
    },
  })
  return userRoles
}

async function hasRequiredPermissions(requiredPermissions: string[]): Promise<boolean> {
  const user = await getCurrentUser()
  if (user) {
    const userRoles = await getUserRoles(user.id)
    return userRoles.some((userRole) => {
      return requiredPermissions.some((permission) => {
        return userRole.role.permissions.some(
          (rolePermission) => rolePermission.permission.key === permission,
        )
      })
    })
  }
  return false
}

export async function protectPage(requiredPermissions: string[]) {
  const hasPermission = await hasRequiredPermissions(requiredPermissions)
  if (hasPermission) {
    return true
  } else {
    redirect("/auth/error/?error=AccessUnauthorized")
  }
}

export async function ProtectComponent({
  children,
  requiredPermissions,
  fallback,
}: {
  children: any
  requiredPermissions: string[]
  fallback?: any
}) {
  const hasPermission = await hasRequiredPermissions(requiredPermissions)
  if (hasPermission) {
    return <>{children}</>
  }
  if (fallback) {
    return <>{fallback}</>
  }

  return null
}

type RoleCheck = { role: string[]; permission?: never }
type PermissionCheck = { permission: string[]; role?: never }

type Opts = RoleCheck | PermissionCheck

export async function has(check: Opts): Promise<boolean> {
  if (check.role) {
    return false
  }
  if (check.permission) {
    const hasPermission = await hasRequiredPermissions(check.permission!)
    return hasPermission
  }
  return false
}
