import { notFound } from "next/navigation"

import prismadb from "@/utils/prismadb"

import { CopyButtonData } from "@/components/copy-clipboard-button"
import { Separator } from "@/components/ui/separator"

import DeletePermissionModal from "./_components/delete-permission-modal"
import PermissionForm from "./_components/permission-form"

export default async function PermissionPage({
  params,
}: {
  params: { permissionId: string }
}) {
  const getPermission = async () => {
    if (params.permissionId === "new") {
      return null
    } else {
      const id = Number(params.permissionId)

      if (!id) {
        return notFound()
      }

      const permission = await prismadb.permission.findUnique({
        where: { id },
      })

      if (!permission) {
        return notFound()
      }

      return permission
    }
  }

  const permission = await getPermission()

  const title = permission ? "Edit permission" : "Create permission"
  const description = permission ? `ID: ${permission.id}` : "Add a new permission"

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <div className="flex items-center justify-start">
            <p className="text-muted-foreground">{description}</p>
            {permission?.id && <CopyButtonData textToCopy={String(permission.id)} />}
          </div>
        </div>
        {permission && <DeletePermissionModal permission={permission} />}
      </div>
      <Separator className="my-6" />
      <PermissionForm permission={permission} />
    </>
  )
}
