"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { DataTableColumnHeader } from "@/components/ui/data-tables/data-table-column-header"

import CellActions from "./cell-actions"

export type IColumns =
  | ({
      permission: {
        id: number
        name: string
        description: string
        key: string
        createdAt: Date
        updatedAt: Date
      }
    } & {
      permissionId: number
      roleId: number
      createdAt: Date
    })
  | undefined

export const columns: ColumnDef<IColumns>[] = [
  {
    id: "permission.name",
    accessorKey: "permission.name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
  },
  {
    accessorKey: "permission.description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
  },
  {
    accessorKey: "permission.key",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Key" />,
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
