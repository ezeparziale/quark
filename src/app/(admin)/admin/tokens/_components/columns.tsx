"use client"

import Link from "next/link"

import { type Token } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { formatDistanceToNow } from "date-fns"

import { Badge } from "@/components/ui/badge"
import { DataTableColumnHeader } from "@/components/ui/data-tables/data-table-column-header"
import { DateCell } from "@/components/ui/data-tables/date-cell"

import CellActions from "./cell-actions"

export interface IColumns
  extends Pick<
    Token,
    "id" | "name" | "partialToken" | "lastUsed" | "createdAt" | "updatedAt"
  > {
  user: { username: string; id: number }
}

export const columns: ColumnDef<IColumns>[] = [
  {
    id: "username",
    accessorKey: "user.username",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Username" />,
    enableGlobalFilter: true,
    cell: ({ row }) => {
      const userId = row.original.user.id
      return (
        <Link href={`/admin/users/${userId}`} className="hover:underline">
          {row.original.user.username}
        </Link>
      )
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    enableGlobalFilter: true,
  },
  {
    accessorKey: "partialToken",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Partial Token" />
    ),
    cell: ({ row }) => {
      return <Badge variant={"teal-subtle"}>{row.original.partialToken}</Badge>
    },
    enableGlobalFilter: true,
  },
  {
    accessorKey: "lastUsed",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Last used" />,
    cell: ({ row }) => (
      <DateCell date={row.original.lastUsed} fallbackText="Never used" />
    ),
    enableGlobalFilter: false,
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
