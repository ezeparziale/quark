"use client"

import { type Permission } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"

import { Badge } from "@/components/ui/badge"
import { DataTableColumnHeader } from "@/components/ui/data-tables/data-table-column-header"

import CellActions from "./cell-actions"

export interface IColumns extends Permission {}

export const columns: ColumnDef<IColumns>[] = [
  {
    id: "ID",
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
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
    id: "Created At",
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const formattedDate = format(new Date(row.original.createdAt), "dd-MM-yyyy")
      const formattedTime = format(new Date(row.original.createdAt), "HH:mm:ss")

      return (
        <div className="text-xs">
          <div>{formattedDate}</div>
          <div>{formattedTime}</div>
        </div>
      )
    },
  },
  {
    id: "Updated At",
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated At" />
    ),
    cell: ({ row }) => {
      const formattedDate = format(new Date(row.original.updatedAt), "dd-MM-yyyy")
      const formattedTime = format(new Date(row.original.updatedAt), "HH:mm:ss")

      return (
        <div className="text-xs">
          <div>{formattedDate}</div>
          <div>{formattedTime}</div>
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <CellActions row={row.original} />
    },
  },
]
