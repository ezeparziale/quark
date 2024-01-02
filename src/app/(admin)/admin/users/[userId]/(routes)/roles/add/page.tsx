import { protectPage } from "@/lib/rbac"
import prismadb from "@/utils/prismadb"

import { Separator } from "@/components/ui/separator"

import AddRoleToUserForm from "./_components/add-role-to-user-form"

const title = "Roles"

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

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-lg font-medium">Roles</h3>
            <p className="text-sm text-muted-foreground">Add roles to this user</p>
          </div>
        </div>
        <Separator />
        <AddRoleToUserForm
          options={options}
          selectedValues={selectedValues}
          title={title}
          userId={userId}
        />
      </div>
    </>
  )
}
