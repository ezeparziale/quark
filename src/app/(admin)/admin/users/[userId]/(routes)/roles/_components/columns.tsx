"use client"

import { ColumnDef } from "@tanstack/react-table"

import { DataTableColumnHeader } from "@/components/ui/data-tables/data-table-column-header"

import CellActions from "./cell-actions"

export interface IColumns {
  userId: number
  roleId: number
  role: {
    id: number
    name: string
  }
}

export const columns: ColumnDef<IColumns>[] = [
  {
    id: "name",
    accessorKey: "role.name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <CellActions row={row.original} />
    },
  },
]
