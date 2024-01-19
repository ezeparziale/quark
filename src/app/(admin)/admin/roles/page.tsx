import { redirect } from "next/navigation"

import { Suspense } from "react"

import { getServerAuthSession } from "@/lib/auth"
import { protectPage } from "@/lib/rbac"

import { PageHeader } from "@/components/page-header"

import CreateRoleButton from "./_components/create-role-button"
import LoadingRolesTable from "./_components/loading-roles-table"
import RolesTable from "./_components/roles-table"

export default async function RolesAdminPage() {
  const session = await getServerAuthSession()

  if (!session) {
    redirect("/auth/login?callbackUrl=/admin/roles")
  }

  await protectPage({ permission: "admin:all" })

  return (
    <>
      <PageHeader
        title="Roles"
        description="Manage all roles."
        action={<CreateRoleButton />}
        linkBack="/admin"
      />
      <Suspense fallback={<LoadingRolesTable />}>
        <RolesTable />
      </Suspense>
    </>
  )
}
