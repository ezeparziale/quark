import { redirect } from "next/navigation"

import { Suspense } from "react"

import { getServerAuthSession } from "@/lib/auth"
import { protectPage } from "@/lib/rbac"

import { PageHeader } from "@/components/page-header"

import CreateUserButton from "./_components/create-user-button"
import LoadingUsersTable from "./_components/loading-users-table"
import UsersTable from "./_components/users-table"

export default async function UsersAdminPage() {
  const session = await getServerAuthSession()

  if (!session) {
    redirect("/auth/login?callbackUrl=/admin/users")
  }

  await protectPage({ permission: "admin:all" })

  return (
    <>
      <PageHeader
        title="Users"
        description="Manage all user accounts."
        action={<CreateUserButton />}
        linkBack="/admin"
      />
      <Suspense fallback={<LoadingUsersTable />}>
        <UsersTable />
      </Suspense>
    </>
  )
}
