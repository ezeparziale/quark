import prismadb from "@/lib/prismadb"
import { protectPage } from "@/lib/rbac"

import { DataTable } from "@/components/ui/data-tables/data-table"

import { PageSection } from "@/components/page-header"

import AddRoleButton from "./_components/add-role-button"
import { columns } from "./_components/columns"
import AddRolesEmptyStateTable from "./_components/roles-empty-state-table"

type Params = Promise<{ userId: number }>

export default async function UsersAdminRolesPage(props: { params: Params }) {
  await protectPage({ permission: "admin:all" })

  const params = await props.params
  const userId = Number(params.userId)

  const data = await prismadb.user.findUnique({
    where: { id: userId },
    include: { roles: { include: { role: true } } },
  })

  const dataRoles = data?.roles || []

  return (
    <>
      <PageSection
        title="Roles"
        description="Add roles to this user."
        actions={<AddRoleButton id={String(userId)} />}
      />
      <DataTable
        columns={columns}
        data={dataRoles}
        searchFieldLabel={"roles"}
        emptyState={<AddRolesEmptyStateTable id={String(userId)} />}
        hideTableViewOption
      />
    </>
  )
}
