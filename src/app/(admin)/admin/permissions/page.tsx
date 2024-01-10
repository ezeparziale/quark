import { redirect } from "next/navigation"

import { getServerAuthSession } from "@/lib/auth"
import { protectPage } from "@/lib/rbac"
import prismadb from "@/utils/prismadb"

import MainAdminHeader from "@/components/admin/main-admin-header"
import { DataTable } from "@/components/ui/data-tables/data-table"

import { columns } from "./_components/columns"

export default async function PermissionsAdminPage() {
  const session = await getServerAuthSession()

  if (!session) {
    redirect("/auth/login?callbackUrl=/admin/permissions")
  }

  await protectPage({ permission: "admin:all" })

  const data = await prismadb.permission.findMany({ orderBy: { updatedAt: "desc" } })

  return (
    <MainAdminHeader
      title="Permissions"
      description="Manage all permissions."
      actionHrefLink="/admin/permissions/new"
      actionLabelSrOnly="create permission"
    >
      <DataTable columns={columns} data={data} searchField={"name"} />
    </MainAdminHeader>
  )
}
