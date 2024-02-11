import { notFound } from "next/navigation"

import prismadb from "@/lib/prismadb"
import { protectPage } from "@/lib/rbac"

import { PageSection } from "@/components/page-header"

import RoleForm from "../_components/create-role-form"

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
    <>
      <PageSection title={title} description={description} />
      <RoleForm role={role} />
    </>
  )
}
