import Link from "next/link"
import { redirect } from "next/navigation"

import { getServerAuthSession } from "@/lib/auth"
import prismadb from "@/utils/prismadb"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-tables/data-table"
import { Separator } from "@/components/ui/separator"

import { columns } from "./columns"

export default async function UsersAdmin() {
  const session = await getServerAuthSession()

  if (!session) {
    redirect("/auth/login?callbackUrl=/admin/users")
  }

  const data = await prismadb.user.findMany()

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">Manage all users account.</p>
        </div>
        <Button asChild>
          <Link href="/admin/users/new-user">
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
