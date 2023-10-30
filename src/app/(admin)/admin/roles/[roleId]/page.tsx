import { notFound } from "next/navigation"

import prismadb from "@/utils/prismadb"

import { Separator } from "@/components/ui/separator"

import RoleForm from "./_components/role-form"

export default async function RoleView({ params }: { params: { roleId: string } }) {
  const getRole = async () => {
    if (params.roleId === "new") {
      return null
    } else {
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
