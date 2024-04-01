import prismadb from "@/lib/prismadb"
import { protectPage } from "@/lib/rbac"

import { PageSection } from "@/components/page-header"
import { DataTable } from "@/components/ui/data-tables/data-table"

import AddPermissionButton from "./_components/add-permission-button"
import { columns } from "./_components/columns"
import AddPermissionsEmptyStateTable from "./_components/permissions-empty-state-table"

export default async function RolesAdminPermissionsPage({
  params,
}: {
  params: { roleId: number }
}) {
  await protectPage({ permission: "admin:all" })

  const roleId = Number(params.roleId)

  const data = await prismadb.role.findUnique({
    where: { id: roleId },
    include: { permissions: { include: { permission: true } } },
  })

  const dataPermissions = data?.permissions || []

  return (
    <>
      <PageSection
        title="Permissions"
        description="Add permissions to this role."
        actions={<AddPermissionButton id={roleId} />}
      />
      <DataTable
        columns={columns}
        data={dataPermissions}
        searchField={"permission.name"}
        emptyState={<AddPermissionsEmptyStateTable id={roleId} />}
      />
    </>
  )
}
