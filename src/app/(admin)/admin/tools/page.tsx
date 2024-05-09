import { redirect } from "next/navigation"

import { Suspense } from "react"

import { auth } from "@/auth"

import { protectPage } from "@/lib/rbac"

import TableLoading from "@/components/admin/table-loading"
import { PageHeader } from "@/components/page-header"

import CreateToolButton from "./_components/create-tool-button"
import ToolsTable from "./_components/tools-table"

export default async function ToolsAdminPage() {
  const session = await auth()

  if (!session) {
    redirect("/auth/login?callbackUrl=/admin/tools")
  }

  await protectPage({ permission: "admin:all" })

  return (
    <>
      <PageHeader
        title="Tools"
        description="Manage all tools."
        actions={<CreateToolButton />}
      />
      <Suspense fallback={<TableLoading />}>
        <ToolsTable />
      </Suspense>
    </>
  )
}
