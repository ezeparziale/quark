import { protectPage } from "@/lib/rbac"
import prismadb from "@/utils/prismadb"

import PageAdminHeader from "@/components/admin/page-admin-header"
import { DataTable } from "@/components/ui/data-tables/data-table"

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
  const action = {
    actionHrefLink: `/admin/users/${userId}/roles/add`,
    actionLabel: "Add roles",
    actionLabelSrOnly: "add roles to this user",
  }

  return (
    <PageAdminHeader title={title} description={description} action={{ action }}>
      <DataTable columns={columns} data={data2} searchField={"name"} />
    </PageAdminHeader>
  )
}
