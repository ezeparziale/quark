import Link from "next/link"

import React from "react"

import prismadb from "@/utils/prismadb"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-tables/data-table"
import { Separator } from "@/components/ui/separator"

import { columns } from "./_components/columns"

export default async function page({ params }: { params: { roleId: string } }) {
  const { roleId } = params

  const data = await prismadb.role.findUnique({
    where: { id: Number(roleId) },
    include: { permissions: { include: { permission: true } } },
  })

  const dataPermissions = data?.permissions || []

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-lg font-medium">Permissions</h3>
            <p className="text-sm text-muted-foreground">
              Add permissions to this role
            </p>
          </div>
          <Button size="sm" asChild>
            <Link href={`/admin/roles/${roleId}/permissions/add`}>
              <Plus className="h-4 w-4" />
              <span className="sr-only">add permission to role</span>
              <span className="ml-2 hidden md:block">Add permission</span>
            </Link>
          </Button>
        </div>
        <Separator />
        <DataTable
          columns={columns}
          data={dataPermissions}
          searchField={"permission.name"}
        />
      </div>
    </>
  )
}
