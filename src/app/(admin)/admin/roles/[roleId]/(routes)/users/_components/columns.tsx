"use client"

import { User, UserRole } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"

import { DataTableColumnHeader } from "@/components/ui/data-tables/data-table-column-header"

import CellActions from "./cell-actions"

export interface IColumns extends UserRole {
  user: User
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
