import { protectPage } from "@/lib/rbac"
import prismadb from "@/utils/prismadb"

import PageAdminHeader from "@/components/admin/page-admin-header"

import AddUserForm from "./_components/user-form"

export default async function RolesAdminAddUsersPage({
  params,
}: {
  params: { roleId: string }
}) {
  await protectPage({ permission: "admin:all" })

  const { roleId } = params

  const selectedOptions = await prismadb.role.findUnique({
    where: { id: Number(roleId) },
    include: { users: { include: { user: true } } },
  })

  const users = await prismadb.user.findMany()

  const options = users.map((user) => ({
    value: user.id,
    label: user.email,
  }))

  const selectedValues = new Set(selectedOptions?.users.map((user) => user.userId))

  const title = "Users"
  const description = "Add users to this role"

  return (
    <PageAdminHeader title={title} description={description}>
      <AddUserForm
        options={options}
        selectedValues={selectedValues}
        title={title}
        roleId={roleId}
      />
    </PageAdminHeader>
  )
}
