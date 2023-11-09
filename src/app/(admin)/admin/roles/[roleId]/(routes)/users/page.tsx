import Link from "next/link"

import React from "react"

import { withRoles } from "@/lib/rbac"
import prismadb from "@/utils/prismadb"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-tables/data-table"
import { Separator } from "@/components/ui/separator"

import { columns } from "./_components/columns"

const RolesAdminUsersPage = async ({ params }: { params: { roleId: string } }) => {
  const { roleId } = params

  const data = await prismadb.role.findUnique({
    where: { id: Number(roleId) },
    include: { users: { include: { user: true } } },
  })

  const data2 = data?.users || []

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-lg font-medium">Users</h3>
            <p className="text-sm text-muted-foreground">Add users to this role</p>
          </div>
          <Button size="sm" asChild>
            <Link href={`/admin/roles/${roleId}/users/add`}>
              <Plus className="h-4 w-4" />
              <span className="sr-only">add users to this role</span>
              <span className="ml-2 hidden md:block">Add users</span>
            </Link>
          </Button>
        </div>
        <Separator />
        <DataTable columns={columns} data={data2} searchField={"email"} />
      </div>
    </>
  )
}

export default withRoles(RolesAdminUsersPage, ["admin:all"])
