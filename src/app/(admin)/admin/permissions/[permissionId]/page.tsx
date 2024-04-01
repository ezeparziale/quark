import { notFound } from "next/navigation"

import { getPermissionById } from "@/data/permission"
import { protectPage } from "@/lib/rbac"

import { PageHeader } from "@/components/page-header"

import DeletePermissionModal from "../_components/delete-permission-modal"
import PermissionForm from "../_components/permission-form"

export default async function EditPermissionPage({
  params,
}: {
  params: { permissionId: number }
}) {
  await protectPage({ permission: "admin:all" })

  const id = Number(params.permissionId)

  if (!id) {
    return notFound()
  }

  const permission = await getPermissionById(id)

  if (!permission) {
    return notFound()
  }

  return (
    <>
      <PageHeader
        title={`Edit permission ${permission.name}`}
        description={`ID: ${permission.id}`}
        linkBack={"/admin/permissions"}
        copy={String(`${permission.id}`)}
        actions={<DeletePermissionModal permission={permission} />}
      />
      <PermissionForm permission={permission} />
    </>
  )
}
