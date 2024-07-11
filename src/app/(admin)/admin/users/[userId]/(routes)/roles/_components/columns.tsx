"use client"

import Link from "next/link"

import { type Role, type UserRole } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"

import { DataTableColumnHeader } from "@/components/ui/data-tables/data-table-column-header"

import CellActions from "./cell-actions"

export interface IColumns extends UserRole {
  role: Role
}

export const columns: ColumnDef<IColumns>[] = [
  {
    id: "name",
    accessorKey: "role.name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" disableColumnHide />
    ),
    cell: ({ row }) => {
      const linkName = (
        <Link href={`/admin/roles/${row.original.role.id}`}>
          {row.original.role.name}
        </Link>
      )
      return linkName
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <CellActions row={row.original} />
    },
  },
]
