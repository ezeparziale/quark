import { notFound } from "next/navigation"

import { protectPage } from "@/lib/rbac"
import prismadb from "@/utils/prismadb"

import { Separator } from "@/components/ui/separator"

import RoleForm from "../_components/role-form"

export default async function RoleAdminPage({
  params,
}: {
  params: { roleId: string }
}) {
  await protectPage(["admin:all"])

  const getRole = async () => {
    const id = Number(params.roleId)

    if (!id) {
      return notFound()
    }

    const role = await prismadb.role.findUnique({
      where: { id },
    })

    if (!role) {
      return notFound()
    }

    return role
  }

  const role = await getRole()

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-lg font-medium">Settings</h3>
            <p className="text-sm text-muted-foreground">Manage role settings</p>
          </div>
        </div>
        <Separator />
        <RoleForm role={role} />
      </div>
    </>
  )
}
