import prismadb from "@/lib/prismadb"
import { protectPage } from "@/lib/rbac"

import { PageSection } from "@/components/page-header"

import AddUserForm from "../_components/add-user-form"

export default async function RolesAdminAddUsersPage({
  params,
}: {
  params: { roleId: number }
}) {
  await protectPage({ permission: "admin:all" })

  const roleId = Number(params.roleId)

  const selectedOptions = await prismadb.role.findUnique({
    where: { id: roleId },
    include: { users: { include: { user: true } } },
  })

  const users = await prismadb.user.findMany()

  const options = users.map((user) => ({
    value: user.id,
    label: user.email,
  }))

  const selectedValues = new Set(selectedOptions?.users.map((user) => user.userId))

  return (
    <>
      <PageSection title="Users" description="Add users to this role." />
      <AddUserForm
        options={options}
        selectedValues={selectedValues}
        title="Users"
        roleId={roleId}
      />
    </>
  )
}
