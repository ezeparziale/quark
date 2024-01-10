import { protectPage } from "@/lib/rbac"
import prismadb from "@/utils/prismadb"

import PageAdminHeader from "@/components/admin/page-admin-header"
import { DataTable } from "@/components/ui/data-tables/data-table"

import { columns } from "./_components/columns"

export default async function RolesAdminPermissionsPage({
  params,
}: {
  params: { roleId: string }
}) {
  await protectPage({ permission: "admin:all" })

  const { roleId } = params

  const data = await prismadb.role.findUnique({
    where: { id: Number(roleId) },
    include: { permissions: { include: { permission: true } } },
  })

  const dataPermissions = data?.permissions || []

  const title = "Permissions"
  const description = "Add permissions to this role"
  const action = {
    actionHrefLink: `/admin/roles/${roleId}/permissions/add`,
    actionLabel: "Add permissions",
    actionLabelSrOnly: "dd permission to role",
  }

  return (
    <PageAdminHeader title={title} description={description} action={{ action }}>
      <DataTable
        columns={columns}
        data={dataPermissions}
        searchField={"permission.name"}
      />
    </PageAdminHeader>
  )
}
