import { notFound } from "next/navigation"

import { protectPage } from "@/lib/rbac"

import { getPermissionById } from "@/data/permission"

import { PageHeader } from "@/components/page-header"

import DeletePermissionButton from "./_components/delete-permission-button"
import EditPermissionForm from "./_components/edit-permission-form"

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
        copySuccessMessage={"Permission ID copied!"}
        copyLabel="Copy permission ID"
        actions={
          <DeletePermissionButton
            permissionId={permission.id}
            permissionKey={permission.key}
          />
        }
      />
      <EditPermissionForm permission={permission} />
    </>
  )
}
