import { protectPage } from "@/lib/rbac"
import prismadb from "@/utils/prismadb"

import PageAdminHeader from "@/components/admin/page-admin-header"
import { DataTable } from "@/components/ui/data-tables/data-table"

import { columns } from "./_components/columns"

export default async function RolesAdminUsersPage({
  params,
}: {
  params: { roleId: string }
}) {
  await protectPage({ permission: "admin:all" })

  const { roleId } = params

  const data = await prismadb.role.findUnique({
    where: { id: Number(roleId) },
    include: { users: { include: { user: true } } },
  })

  const data2 = data?.users || []

  const title = "Users"
  const description = "Add users to this role"
  const action = {
    actionHrefLink: `/admin/roles/${roleId}/users/add`,
    actionLabel: "Add users",
    actionLabelSrOnly: "add users to this role",
  }

  return (
    <PageAdminHeader title={title} description={description} action={{ action }}>
      <DataTable columns={columns} data={data2} searchField={"email"} />
    </PageAdminHeader>
  )
}
