import { notFound } from "next/navigation"

import prismadb from "@/lib/prismadb"
import { protectPage } from "@/lib/rbac"

import { PageSection } from "@/components/page-header"

import EditRoleForm from "./_components/edit-role-form"

type Params = Promise<{ roleId: number }>

export default async function RoleAdminPage(props: { params: Params }) {
  await protectPage({ permission: "admin:all" })

  const params = await props.params
  const id = Number(params.roleId)

  if (!id) {
    return notFound()
  }

  const role = await prismadb.role.findUnique({
    where: { id },
    include: {
      permissions: { include: { permission: { select: { id: true, name: true } } } },
    },
  })

  if (!role) {
    return notFound()
  }

  const permissionsSelectedOptions = role.permissions.map((permission) => ({
    value: String(permission.permission.id),
    label: permission.permission.name,
  }))

  const roleWithFormattedPermissions = {
    ...role,
    permissionsSelectedOptions,
  }

  return (
    <>
      <PageSection title="Settings" description="Manage role settings" />
      <EditRoleForm role={roleWithFormattedPermissions} />
    </>
  )
}
