import Link from "next/link"
import { redirect } from "next/navigation"

import { getServerAuthSession } from "@/lib/auth"
import { protectPage } from "@/lib/rbac"
import prismadb from "@/utils/prismadb"
import { Plus } from "lucide-react"

import BackButtonLink from "@/components/back-button-link"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-tables/data-table"
import { Separator } from "@/components/ui/separator"

import { columns } from "./_components/columns"

export default async function UsersAdminPage() {
  const session = await getServerAuthSession()

  if (!session) {
    redirect("/auth/login?callbackUrl=/admin/users")
  }

  await protectPage(["admin:all"])

  const data = await prismadb.user.findMany({ orderBy: { updatedAt: "desc" } })

  return (
    <>
      <BackButtonLink link={"/admin"} />
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">Manage all user accounts.</p>
        </div>
        <Button asChild>
          <Link href="/admin/users/new">
            <Plus className="h-4 w-4" />
            <span className="sr-only">create user</span>
            <span className="ml-2 hidden md:block">Create</span>
          </Link>
        </Button>
      </div>
      <Separator className="my-6" />
      <DataTable columns={columns} data={data} searchField="email" />
    </>
  )
}
