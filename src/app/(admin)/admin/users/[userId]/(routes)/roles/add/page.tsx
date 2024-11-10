import prismadb from "@/lib/prismadb"
import { protectPage } from "@/lib/rbac"

import { PageSection } from "@/components/page-header"

import AddRoleForm from "../_components/add-role-form"

type Params = Promise<{ userId: number }>

export default async function UsersAdminAddRolesToUserPage(props: { params: Params }) {
  await protectPage({ permission: "admin:all" })

  const params = await props.params
  const userId = Number(params.userId)

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

  return (
    <>
      <PageSection title="Roles" description="Add roles to this user." />
      <AddRoleForm
        options={options}
        selectedValues={selectedValues}
        title="Roles"
        userId={userId}
      />
    </>
  )
}
