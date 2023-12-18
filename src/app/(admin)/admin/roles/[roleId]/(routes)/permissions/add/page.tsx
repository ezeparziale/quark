import { protectPage } from "@/lib/rbac"
import prismadb from "@/utils/prismadb"

import { Separator } from "@/components/ui/separator"

import AddPermissionForm from "./_components/permission-form"

const title = "Permissions"

export default async function RolesAdminAddPermissionsPage({
  params,
}: {
  params: { roleId: string }
}) {
  await protectPage(["admin:all"])

  const { roleId } = params

  const selectedOptions = await prismadb.role.findUnique({
    where: { id: Number(roleId) },
    include: { permissions: { include: { permission: true } } },
  })

  const permissions = await prismadb.permission.findMany()

  const options = permissions.map((permission) => ({
    value: String(permission.id),
    label: permission.name,
  }))

  const selectedValues = new Set(
    selectedOptions?.permissions.map((permission) => String(permission.permissionId)),
  )

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-lg font-medium">Permissions</h3>
            <p className="text-sm text-muted-foreground">
              Add permissions to this role
            </p>
          </div>
        </div>
        <Separator />
        <AddPermissionForm
          options={options}
          selectedValues={selectedValues}
          title={title}
          roleId={roleId}
        />
      </div>
    </>
  )
}
