import { redirect } from "next/navigation"

import { Suspense } from "react"

import { auth } from "@/auth"

import { protectPage } from "@/lib/rbac"

import { getUsers } from "@/data/user"

import TableLoading from "@/components/admin/table-loading"
import { ErrorBoundary } from "@/components/error-boundary"
import { PageHeader } from "@/components/page-header"

import CreateUserButton from "./_components/create-user-button"
import UsersTable from "./_components/users-table"

export default async function UsersAdminPage() {
  const session = await auth()

  if (!session) {
    redirect("/auth/login?callbackUrl=/admin/users")
  }

  await protectPage({ permission: "admin:all" })

  const usersPromise = getUsers()

  return (
    <>
      <PageHeader
        title="Users"
        description="Manage all user accounts."
        actions={<CreateUserButton />}
      />
      <ErrorBoundary>
        <Suspense fallback={<TableLoading />}>
          <UsersTable usersPromise={usersPromise} />
        </Suspense>
      </ErrorBoundary>
    </>
  )
}
