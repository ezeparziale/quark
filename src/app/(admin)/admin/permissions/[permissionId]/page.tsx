import { notFound } from "next/navigation"

import prismadb from "@/lib/prismadb"
import { protectPage } from "@/lib/rbac"

import { PageHeader } from "@/components/page-header"

import DeletePermissionModal from "../_components/delete-permission-modal"
import PermissionForm from "../_components/permission-form"

export default async function PermissionAdminPage({
  params,
}: {
  params: { permissionId: string }
}) {
  await protectPage({ permission: "admin:all" })

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
  const copy = String(`${permission.id}`)
  const linkBack = "/admin/permissions"

  return (
    <>
      <PageHeader
        title={title}
        description={description}
        linkBack={linkBack}
        copy={copy}
        actions={<DeletePermissionModal permission={permission} />}
      />
      <PermissionForm permission={permission} />
    </>
  )
}
