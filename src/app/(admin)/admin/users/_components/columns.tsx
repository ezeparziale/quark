"use client"

import Link from "next/link"

import { type User } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { DataTableColumnHeader } from "@/components/ui/data-tables/data-table-column-header"

import CellActions from "./cell-actions"

export interface IColumns
  extends Pick<User, "id" | "email" | "username" | "active" | "confirmedEmail"> {}

export const columns: ColumnDef<IColumns>[] = [
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => {
      const linkEmail = (
        <Link href={`/admin/users/${row.original.id}`}>{row.original.email}</Link>
      )
      return linkEmail
    },
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
