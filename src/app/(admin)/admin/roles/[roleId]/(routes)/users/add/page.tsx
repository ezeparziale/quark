import prismadb from "@/lib/prismadb"
import { protectPage } from "@/lib/rbac"

import { PageSection } from "@/components/page-header"

import AddUserForm from "../_components/add-user-form"

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
    <>
      <PageSection title={title} description={description} />
      <AddUserForm
        options={options}
        selectedValues={selectedValues}
        title={title}
        roleId={roleId}
      />
    </>
  )
}
