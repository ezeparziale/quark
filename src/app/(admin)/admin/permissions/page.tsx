import { redirect } from "next/navigation"

import { Suspense } from "react"

import { getServerAuthSession } from "@/lib/auth"
import { protectPage } from "@/lib/rbac"

import TableLoading from "@/components/admin/table-loading"
import { PageHeader } from "@/components/page-header"

import CreatePermissionButton from "./_components/create-permission-button"
import PermissionsTable from "./_components/permissions-table"

export default async function PermissionsAdminPage() {
  const session = await getServerAuthSession()

  if (!session) {
    redirect("/auth/login?callbackUrl=/admin/permissions")
  }

  await protectPage({ permission: "admin:all" })

  return (
    <>
      <PageHeader
        title="Permissions"
        description="Manage all permissions."
        actions={<CreatePermissionButton />}
      />
      <Suspense fallback={<TableLoading />}>
        <PermissionsTable />
      </Suspense>
    </>
  )
}
