import prismadb from "@/lib/prismadb"
import { protectPage } from "@/lib/rbac"

import { PageSection } from "@/components/page-header"
import { DataTable } from "@/components/ui/data-tables/data-table"

import AddRoleButton from "./_components/add-role-button"
import { columns } from "./_components/columns"

export default async function UsersAdminRolesPage({
  params,
}: {
  params: { userId: string }
}) {
  await protectPage({ permission: "admin:all" })

  const { userId } = params

  const data = await prismadb.user.findUnique({
    where: { id: userId },
    include: { roles: { include: { role: true } } },
  })
  const data2 = data?.roles || []

  const title = "Roles"
  const description = "Add roles to this user"

  return (
    <>
      <PageSection
        title={title}
        description={description}
        action={<AddRoleButton id={userId} />}
      />
      <DataTable columns={columns} data={data2} searchField={"name"} />
    </>
  )
}
