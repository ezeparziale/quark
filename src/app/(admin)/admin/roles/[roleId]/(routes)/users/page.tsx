import prismadb from "@/lib/prismadb"
import { protectPage } from "@/lib/rbac"

import { PageSection } from "@/components/page-header"
import { DataTable } from "@/components/ui/data-tables/data-table"

import AddUserButton from "./_components/add-user-button"
import { columns } from "./_components/columns"
import AddUsersEmptyStateTable from "./_components/users-empty-state-table"

export default async function RolesAdminUsersPage({
  params,
}: {
  params: { roleId: number }
}) {
  await protectPage({ permission: "admin:all" })

  const roleId = Number(params.roleId)

  const data = await prismadb.role.findUnique({
    where: { id: roleId },
    include: { users: { include: { user: true } } },
  })

  const dataUsers = data?.users || []

  return (
    <>
      <PageSection
        title="Users"
        description="Add users to this role."
        actions={<AddUserButton id={Number(roleId)} />}
      />
      <DataTable
        columns={columns}
        data={dataUsers}
        searchField={"email"}
        emptyState={<AddUsersEmptyStateTable id={roleId} />}
      />
    </>
  )
}
