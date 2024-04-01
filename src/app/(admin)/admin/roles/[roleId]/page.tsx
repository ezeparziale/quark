import { notFound } from "next/navigation"

import prismadb from "@/lib/prismadb"
import { protectPage } from "@/lib/rbac"

import { PageSection } from "@/components/page-header"

import RoleForm from "../_components/role-form"

export default async function RoleAdminPage({
  params,
}: {
  params: { roleId: number }
}) {
  await protectPage({ permission: "admin:all" })

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

  return (
    <>
      <PageSection title="Settings" description="Manage role settings" />
      <RoleForm role={role} />
    </>
  )
}
