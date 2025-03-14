import prismadb from "@/lib/prismadb"
import { protectPage } from "@/lib/rbac"

import { PageSection } from "@/components/page-header"

import AddPermissionForm from "../_components/add-permission-form"

type Params = Promise<{ roleId: number }>

export default async function RolesAdminAddPermissionsPage(props: { params: Params }) {
  await protectPage({ permission: "admin:all" })

  const params = await props.params
  const roleId = Number(params.roleId)

  const selectedOptions = await prismadb.role.findUnique({
    where: { id: roleId },
    include: { permissions: { include: { permission: true } } },
  })

  const permissions = await prismadb.permission.findMany()

  const options = permissions.map((permission) => ({
    value: permission.id,
    label: permission.key,
  }))

  const selectedValues = new Set(
    selectedOptions?.permissions.map((permission) => permission.permissionId),
  )

  return (
    <>
      <PageSection title="Permissions" description="Add permissions to this role." />
      <AddPermissionForm
        options={options}
        selectedValues={selectedValues}
        title="Permissions"
        roleId={roleId}
      />
    </>
  )
}
