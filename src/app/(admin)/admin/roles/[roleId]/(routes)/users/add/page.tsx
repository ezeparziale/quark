import { withRoles } from "@/lib/rbac"
import prismadb from "@/utils/prismadb"

import { Separator } from "@/components/ui/separator"

import AddUserForm from "./_components/user-form"

const title = "Users"

const RolesAdminAddUsersPage = async ({ params }: { params: { roleId: string } }) => {
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

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-lg font-medium">Users</h3>
            <p className="text-sm text-muted-foreground">Add users to this role</p>
          </div>
        </div>
        <Separator />
        <AddUserForm
          options={options}
          selectedValues={selectedValues}
          title={title}
          roleId={roleId}
        />
      </div>
    </>
  )
}

export default withRoles(RolesAdminAddUsersPage, ["admin:all"])
