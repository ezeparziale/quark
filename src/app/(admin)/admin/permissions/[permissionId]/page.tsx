import { notFound } from "next/navigation"

import { protectPage } from "@/lib/rbac"
import prismadb from "@/utils/prismadb"

import BackButtonLink from "@/components/back-button-link"
import { CopyButtonData } from "@/components/copy-clipboard-button"
import { Separator } from "@/components/ui/separator"

import PermissionForm from "../_components/permission-form"
import DeletePermissionModal from "./_components/delete-permission-modal"

export default async function PermissionAdminPage({
  params,
}: {
  params: { permissionId: string }
}) {
  await protectPage(["admin:all"])

  const getPermission = async () => {
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

  const permission = await getPermission()

  const title = `Edit permission ${permission.name}`
  const description = `ID: ${permission.id}`

  return (
    <>
      <BackButtonLink link={"/admin/permissions"} />
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <div className="flex items-center justify-start">
            <p className="text-muted-foreground">{description}</p>
            <CopyButtonData textToCopy={String(permission.id)} />
          </div>
        </div>
        <DeletePermissionModal permission={permission} />
      </div>
      <Separator className="my-6" />
      <PermissionForm permission={permission} />
    </>
  )
}
