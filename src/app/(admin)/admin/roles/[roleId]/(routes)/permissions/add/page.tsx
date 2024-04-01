import prismadb from "@/lib/prismadb"
import { protectPage } from "@/lib/rbac"

import { PageSection } from "@/components/page-header"

import AddPermissionForm from "../_components/add-permission-form"

export default async function RolesAdminAddPermissionsPage({
  params,
}: {
  params: { roleId: number }
}) {
  await protectPage({ permission: "admin:all" })

  const roleId = Number(params.roleId)

  const selectedOptions = await prismadb.role.findUnique({
    where: { id: roleId },
    include: { permissions: { include: { permission: true } } },
  })

  const permissions = await prismadb.permission.findMany()

  const options = permissions.map((permission) => ({
    value: String(permission.id),
    label: permission.key,
  }))

  const selectedValues = new Set(
    selectedOptions?.permissions.map((permission) => String(permission.permissionId)),
  )

  return (
    <>
      <PageSection title="Permissions" description="Add permissions to this role." />
      <AddPermissionForm
        options={options}
        selectedValues={selectedValues}
        title="Permissions"
        roleId={String(roleId)}
      />
    </>
  )
}
