import { redirect } from "next/navigation"

import { getServerAuthSession } from "@/lib/auth"
import { protectPage } from "@/lib/rbac"
import prismadb from "@/utils/prismadb"

import MainAdminHeader from "@/components/admin/main-admin-header"
import { DataTable } from "@/components/ui/data-tables/data-table"

import { columns } from "./_components/columns"

export default async function UsersAdminPage() {
  const session = await getServerAuthSession()

  if (!session) {
    redirect("/auth/login?callbackUrl=/admin/users")
  }

  await protectPage(["admin:all"])

  const data = await prismadb.user.findMany({ orderBy: { updatedAt: "desc" } })

  return (
    <MainAdminHeader
      title="Users"
      description="Manage all user accounts."
      actionHrefLink="/admin/users/new"
      actionLabelSrOnly="create user"
    >
      <DataTable columns={columns} data={data} searchField="email" />
    </MainAdminHeader>
  )
}
