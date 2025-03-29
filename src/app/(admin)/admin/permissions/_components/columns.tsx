"use client"

import { type Permission } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { CheckCircle, XCircle } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { DataTableColumnHeader } from "@/components/ui/data-tables/data-table-column-header"
import { DateCell } from "@/components/ui/data-tables/date-cell"

import CellActions from "./cell-actions"

export interface IColumns extends Permission {}

export const columns: ColumnDef<IColumns>[] = [
  {
    id: "ID",
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    enableGlobalFilter: true,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    enableGlobalFilter: true,
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    enableGlobalFilter: true,
  },
  {
    accessorKey: "key",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Key" />,
    cell: ({ row }) => {
      return <Badge variant={"gray-subtle"}>{row.original.key}</Badge>
    },
    enableGlobalFilter: true,
  },
  {
    id: "Active",
    accessorKey: "is_active",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Active" />,
    cell: ({ row }) => {
      return (
        <Badge variant={row.original.isActive ? "green-subtle" : "red-subtle"}>
          {row.original.isActive ? (
            <>
              <CheckCircle size={16} style={{ marginRight: "5px" }} />
              Active
            </>
          ) : (
            <>
              <XCircle size={16} style={{ marginRight: "5px" }} />
              Inactive
            </>
          )}
        </Badge>
      )
    },
    enableGlobalFilter: true,
    sortingFn: (rowA, rowB) => {
      const valueA = rowA.original.isActive ? 1 : 0
      const valueB = rowB.original.isActive ? 1 : 0
      return valueA - valueB
    },
  },
  {
    id: "Created At",
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => <DateCell date={row.original.createdAt} />,
  },
  {
    id: "Updated At",
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated At" />
    ),
    cell: ({ row }) => <DateCell date={row.original.updatedAt} />,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <CellActions row={row.original} />
    },
  },
]
