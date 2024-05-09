import { redirect } from "next/navigation"

import { Suspense } from "react"

import { auth } from "@/auth"

import { protectPage } from "@/lib/rbac"

import TableLoading from "@/components/admin/table-loading"
import { PageHeader } from "@/components/page-header"

import CreateUserButton from "./_components/create-user-button"
import UsersTable from "./_components/users-table"

export default async function UsersAdminPage() {
  const session = await auth()

  if (!session) {
    redirect("/auth/login?callbackUrl=/admin/users")
  }

  await protectPage({ permission: "admin:all" })

  return (
    <>
      <PageHeader
        title="Users"
        description="Manage all user accounts."
        actions={<CreateUserButton />}
      />
      <Suspense fallback={<TableLoading />}>
        <UsersTable />
      </Suspense>
    </>
  )
}
