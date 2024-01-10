import { redirect } from "next/navigation"

import { getServerAuthSession } from "@/lib/auth"
import { protectPage } from "@/lib/rbac"
import prismadb from "@/utils/prismadb"

import MainAdminHeader from "@/components/admin/main-admin-header"
import { DataTable } from "@/components/ui/data-tables/data-table"

import { columns } from "./_components/columns"

export default async function RolesAdminPage() {
  const session = await getServerAuthSession()

  if (!session) {
    redirect("/auth/login?callbackUrl=/admin/roles")
  }

  await protectPage({ permission: "admin:all" })

  const data = await prismadb.role.findMany({ orderBy: { updatedAt: "desc" } })

  return (
    <MainAdminHeader
      title="Roles"
      description="Manage all roles."
      actionHrefLink="/admin/roles/new"
      actionLabelSrOnly="create role"
    >
      <DataTable columns={columns} data={data} searchField={"name"} />
    </MainAdminHeader>
  )
}
