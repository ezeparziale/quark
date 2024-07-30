import Link from "next/link"
import { redirect } from "next/navigation"

import { Suspense } from "react"

import { auth } from "@/auth"
import { ExternalLink } from "lucide-react"

import { protectPage } from "@/lib/rbac"

import { Button } from "@/components/ui/button"

import TableLoading from "@/components/admin/table-loading"
import { PageHeader } from "@/components/page-header"

import CreateTokenButton from "./_components/create-token-button"
import TokensTable from "./_components/tokens-table"

export default async function TokensAdminPage() {
  const session = await auth()

  if (!session) {
    redirect("/auth/login?callbackUrl=/admin/users")
  }

  await protectPage({ permission: "admin:all" })

  return (
    <>
      <PageHeader
        title="Tokens"
        description="Manage all token."
        actions={[
          <ApiDocsLinkButton key={"action_1"} />,
          <CreateTokenButton key={"action_2"} />,
        ]}
      />
      <Suspense fallback={<TableLoading />}>
        <TokensTable />
      </Suspense>
    </>
  )
}

function ApiDocsLinkButton() {
  return (
    <Button variant={"outline"} asChild>
      <Link href={"/api/docs"} target="_blank" passHref>
        <ExternalLink className="size-4" />
        <span className="ml-2">API docs</span>
      </Link>
    </Button>
  )
}
