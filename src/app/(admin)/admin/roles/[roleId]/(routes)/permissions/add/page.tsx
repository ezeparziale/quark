import { protectPage } from "@/lib/rbac"
import prismadb from "@/utils/prismadb"

import PageAdminHeader from "@/components/admin/page-admin-header"

import AddPermissionForm from "./_components/permission-form"

export default async function RolesAdminAddPermissionsPage({
  params,
}: {
  params: { roleId: string }
}) {
  await protectPage(["admin:all"])

  const { roleId } = params

  const selectedOptions = await prismadb.role.findUnique({
    where: { id: Number(roleId) },
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

  const title = "Permissions"
  const description = "Add permissions to this role"

  return (
    <PageAdminHeader title={title} description={description}>
      <AddPermissionForm
        options={options}
        selectedValues={selectedValues}
        title={title}
        roleId={roleId}
      />
    </PageAdminHeader>
  )
}
