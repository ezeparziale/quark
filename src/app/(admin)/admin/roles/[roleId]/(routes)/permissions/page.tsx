import prismadb from "@/lib/prismadb"
import { protectPage } from "@/lib/rbac"

import { DataTable } from "@/components/ui/data-tables/data-table"

import { PageSection } from "@/components/page-header"

import AddPermissionButton from "./_components/add-permission-button"
import { columns } from "./_components/columns"
import AddPermissionsEmptyStateTable from "./_components/permissions-empty-state-table"

type Params = Promise<{ roleId: number }>

export default async function RolesAdminPermissionsPage(props: { params: Params }) {
  await protectPage({ permission: "admin:all" })

  const params = await props.params
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
        searchFieldLabel={"permissions"}
        emptyState={<AddPermissionsEmptyStateTable id={roleId} />}
        hideTableViewOption
      />
    </>
  )
}
