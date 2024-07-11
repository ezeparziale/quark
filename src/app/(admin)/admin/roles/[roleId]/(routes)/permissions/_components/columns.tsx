"use client"

import Link from "next/link"

import { type Permission, type RolePermission } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { DataTableColumnHeader } from "@/components/ui/data-tables/data-table-column-header"

import CellActions from "./cell-actions"

export interface IColumns extends RolePermission {
  permission: Permission
}

export const columns: ColumnDef<IColumns>[] = [
  {
    id: "permission.name",
    accessorKey: "permission.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" disableColumnHide />
    ),
    cell: ({ row }) => {
      const linkName = (
        <Link href={`/admin/permissions/${row.original.permission.id}`}>
          {row.original.permission.name}
        </Link>
      )
      return linkName
    },
  },
  {
    accessorKey: "permission.description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" disableColumnHide />
    ),
  },
  {
    accessorKey: "permission.key",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Key" disableColumnHide />
    ),
    cell: ({ row }) => {
      return <Badge variant={"secondary"}>{row.original?.permission.key}</Badge>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <CellActions row={row.original} />
    },
  },
]
