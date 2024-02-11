import prismadb from "@/lib/prismadb"
import { protectPage } from "@/lib/rbac"

import { PageSection } from "@/components/page-header"

import AddPermissionForm from "../_components/add-permission-form"

export default async function RolesAdminAddPermissionsPage({
  params,
}: {
  params: { roleId: string }
}) {
  await protectPage({ permission: "admin:all" })

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
    <>
      <PageSection title={title} description={description} />
      <AddPermissionForm
        options={options}
        selectedValues={selectedValues}
        title={title}
        roleId={roleId}
      />
    </>
  )
}
