import { redirect } from "next/navigation"

import { Suspense } from "react"

import { getServerAuthSession } from "@/lib/auth"
import { protectPage } from "@/lib/rbac"

import MainAdminHeader from "@/components/admin/main-admin-header"

import LoadingPermissionsTable from "./_components/loading-page"
import TablePermissions from "./_components/table-permissions"

export default async function PermissionsAdminPage() {
  const session = await getServerAuthSession()

  if (!session) {
    redirect("/auth/login?callbackUrl=/admin/permissions")
  }

  await protectPage({ permission: "admin:all" })

  return (
    <MainAdminHeader
      title="Permissions"
      description="Manage all permissions."
      actionHrefLink="/admin/permissions/new"
      actionLabelSrOnly="create permission"
    >
      <Suspense fallback={<LoadingPermissionsTable />}>
        <TablePermissions />
      </Suspense>
    </MainAdminHeader>
  )
}
