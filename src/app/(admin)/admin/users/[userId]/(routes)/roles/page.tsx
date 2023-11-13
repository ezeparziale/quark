import Link from "next/link"

import React from "react"

import { withRoles } from "@/lib/rbac"
import prismadb from "@/utils/prismadb"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-tables/data-table"
import { Separator } from "@/components/ui/separator"

import { columns } from "./_components/columns"

const UsersAdminRolesPage = async ({ params }: { params: { userId: string } }) => {
  const { userId } = params

  const data = await prismadb.user.findUnique({
    where: { id: userId },
    include: { roles: { include: { role: true } } },
  })

  const data2 = data?.roles || []

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-lg font-medium">Roles</h3>
            <p className="text-sm text-muted-foreground">Add roles to this user</p>
          </div>
          <Button size="sm" asChild>
            <Link href={`/admin/users/${userId}/roles/add`}>
              <Plus className="h-4 w-4" />
              <span className="sr-only">add roles to this user</span>
              <span className="ml-2 hidden md:block">Add roles</span>
            </Link>
          </Button>
        </div>
        <Separator />
        <DataTable columns={columns} data={data2} searchField={"name"} />
      </div>
    </>
  )
}

export default withRoles(UsersAdminRolesPage, ["admin:all"])
