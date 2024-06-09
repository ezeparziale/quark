"use client"

import { ColumnDef } from "@tanstack/react-table"

import { DataTableColumnHeader } from "@/components/ui/data-tables/data-table-column-header"

import CellActions from "./cell-actions"

export interface IColumns {
  userId: number
  roleId: number
  user: {
    id: number
    email: string
  }
}

export const columns: ColumnDef<IColumns>[] = [
  {
    id: "email",
    accessorKey: "user.email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <CellActions row={row.original} />
    },
  },
]
