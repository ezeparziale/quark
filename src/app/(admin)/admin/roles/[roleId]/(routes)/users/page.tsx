import { protectPage } from "@/lib/rbac"
import prismadb from "@/utils/prismadb"

import { PageSection } from "@/components/page-header"
import { DataTable } from "@/components/ui/data-tables/data-table"

import AddUserButton from "./_components/add-user-button"
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

  return (
    <>
      <PageSection
        title={title}
        description={description}
        action={<AddUserButton id={Number(roleId)} />}
      />
      <DataTable columns={columns} data={data2} searchField={"email"} />
    </>
  )
}
