"use client"

import Link from "next/link"

import { type Token } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { CheckCircle, XCircle } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DataTableColumnHeader } from "@/components/ui/data-tables/data-table-column-header"
import { DateCell } from "@/components/ui/data-tables/date-cell"

import CellActions from "./cell-actions"

export interface IColumns
  extends Pick<
    Token,
    "id" | "name" | "partialToken" | "lastUsed" | "createdAt" | "updatedAt" | "isActive"
  > {
  user: { username: string; id: number; image: string | null }
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
        <div className="flex items-center justify-start gap-2">
          <Avatar className="size-8 hover:no-underline sm:hidden md:block">
            <AvatarImage src={row.original.user.image!} alt="User avatar" />
            <AvatarFallback>
              {row.original.user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <Link
            href={`/admin/users/${userId}`}
            className="flex items-center gap-x-2 hover:underline"
          >
            <span>{row.original.user.username}</span>
          </Link>
        </div>
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
    id: "Active",
    accessorKey: "isActive",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Active" />,
    cell: ({ row }) => (
      <Badge variant={row.original.isActive ? "green-subtle" : "red-subtle"}>
        {row.original.isActive ? (
          <>
            <CheckCircle size={16} className="mr-1" />
            Active
          </>
        ) : (
          <>
            <XCircle size={16} className="mr-1" />
            Inactive
          </>
        )}
      </Badge>
    ),
    enableGlobalFilter: true,
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
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
