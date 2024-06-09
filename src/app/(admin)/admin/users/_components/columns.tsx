"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { DataTableColumnHeader } from "@/components/ui/data-tables/data-table-column-header"

import CellActions from "./cell-actions"

export interface IUsersColumns {
  id: number
  email: string
  username: string
  active: boolean
  confirmedEmail: boolean
}

export const columns: ColumnDef<IUsersColumns>[] = [
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
  },
  {
    accessorKey: "username",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Username" />,
  },
  {
    accessorKey: "confirmedEmail",
    id: "confirmedEmail",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Confirmed email" />
    ),
    cell: ({ row }) => {
      const value = row.original.confirmedEmail
      const badge = <Badge variant={"gray-subtle"}>{String(value)}</Badge>
      return badge
    },
  },
  {
    accessorKey: "active",
    id: "active",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Active" />,
    cell: ({ row }) => {
      const value = row.original.active
      const badge = (
        <Badge variant={value ? "green-subtle" : "red-subtle"}>{String(value)}</Badge>
      )
      return badge
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <CellActions row={row.original} />
    },
  },
]
