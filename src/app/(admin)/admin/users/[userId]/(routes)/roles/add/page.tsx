import { withRoles } from "@/lib/rbac"
import prismadb from "@/utils/prismadb"

import { Separator } from "@/components/ui/separator"

import AddUserForm from "./_components/user-form"

const title = "Roles"

const UsersAdminAddRolesPage = async ({ params }: { params: { userId: string } }) => {
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
        <AddUserForm
          options={options}
          selectedValues={selectedValues}
          title={title}
          userId={userId}
        />
      </div>
    </>
  )
}

export default withRoles(UsersAdminAddRolesPage, ["admin:all"])
