import { protectPage } from "@/lib/rbac"
import prismadb from "@/utils/prismadb"

import PageAdminHeader from "@/components/admin/page-admin-header"

import AddRoleToUserForm from "./_components/add-role-to-user-form"

export default async function UsersAdminAddRolesToUserPage({
  params,
}: {
  params: { userId: string }
}) {
  await protectPage(["admin:all"])

  const { userId } = params

  const selectedOptions = await prismadb.user.findUnique({
    where: { id: userId },
    include: { roles: { include: { role: true } } },
  })

  const roles = await prismadb.role.findMany()

  const options = roles.map((role) => ({
    value: role.id,
    label: role.name,
  }))

  const selectedValues = new Set(selectedOptions?.roles.map((role) => role.roleId))

  const title = "Roles"
  const description = "Add roles to this user"

  return (
    <PageAdminHeader title={title} description={description}>
      <AddRoleToUserForm
        options={options}
        selectedValues={selectedValues}
        title={title}
        userId={userId}
      />
    </PageAdminHeader>
  )
}
