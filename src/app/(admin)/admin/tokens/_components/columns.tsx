"use client"

import Link from "next/link"

import { type Token } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { format, formatDistanceToNow } from "date-fns"

import { DataTableColumnHeader } from "@/components/ui/data-tables/data-table-column-header"

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
    enableGlobalFilter: true,
  },
  {
    accessorKey: "lastUsed",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Last used" />,
    cell: ({ row }) => {
      const lastUsed = row.original.lastUsed ? new Date(row.original.lastUsed) : null
      const relativeTime = lastUsed
        ? formatDistanceToNow(lastUsed, { addSuffix: true })
        : "Never"

      return <div className="text-xs">{relativeTime}</div>
    },
    enableGlobalFilter: false,
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
