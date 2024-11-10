import prismadb from "@/lib/prismadb"
import { protectPage } from "@/lib/rbac"

import { DataTable } from "@/components/ui/data-tables/data-table"

import { PageSection } from "@/components/page-header"

import AddUserButton from "./_components/add-user-button"
import { columns } from "./_components/columns"
import AddUsersEmptyStateTable from "./_components/users-empty-state-table"

type Params = Promise<{ roleId: number }>

export default async function RolesAdminUsersPage(props: { params: Params }) {
  await protectPage({ permission: "admin:all" })

  const params = await props.params
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
        searchFieldLabel={"emails"}
        emptyState={<AddUsersEmptyStateTable id={roleId} />}
        hideTableViewOption
      />
    </>
  )
}
