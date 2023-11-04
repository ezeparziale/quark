import Link from "next/link"
import { redirect } from "next/navigation"

import { getServerAuthSession } from "@/lib/auth"
import prismadb from "@/utils/prismadb"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-tables/data-table"
import { Separator } from "@/components/ui/separator"

import { columns } from "./columns"

export default async function RolesAdmin() {
  const session = await getServerAuthSession()

  if (!session) {
    redirect("/auth/login?callbackUrl=/admin/roles")
  }

  const data = await prismadb.role.findMany()

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Roles</h2>
          <p className="text-muted-foreground">Manage all roles.</p>
        </div>
        <Button asChild>
          <Link href="/admin/roles/new">
            <Plus className="h-4 w-4" />
            <span className="sr-only">create role</span>
            <span className="ml-2 hidden md:block">Create</span>
          </Link>
        </Button>
      </div>
      <Separator className="my-6" />
      <DataTable columns={columns} data={data} searchField={"name"} />
    </>
  )
}
