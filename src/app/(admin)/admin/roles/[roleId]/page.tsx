import { notFound } from "next/navigation"

import { protectPage } from "@/lib/rbac"
import prismadb from "@/utils/prismadb"

import PageAdminHeader from "@/components/admin/page-admin-header"

import RoleForm from "../_components/role-form"

export default async function RoleAdminPage({
  params,
}: {
  params: { roleId: string }
}) {
  await protectPage({ permission: "admin:all" })

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

  const title = "Settings"
  const description = "Manage role settings"

  return (
    <PageAdminHeader title={title} description={description}>
      <RoleForm role={role} />
    </PageAdminHeader>
  )
}
