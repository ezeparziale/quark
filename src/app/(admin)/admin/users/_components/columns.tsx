"use client"

import Link from "next/link"

import { type User } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"

import { Badge } from "@/components/ui/badge"
import { DataTableColumnHeader } from "@/components/ui/data-tables/data-table-column-header"

import CellActions from "./cell-actions"

export interface IColumns
  extends Pick<
    User,
    | "id"
    | "email"
    | "username"
    | "active"
    | "confirmedEmail"
    | "createdAt"
    | "updatedAt"
  > {}

export const columns: ColumnDef<IColumns>[] = [
  {
    id: "ID",
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
    enableGlobalFilter: true,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => {
      const linkEmail = (
        <Link href={`/admin/users/${row.original.id}`}>{row.original.email}</Link>
      )
      return linkEmail
    },
    enableGlobalFilter: true,
  },
  {
    accessorKey: "username",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Username" />,
    enableGlobalFilter: true,
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
    enableGlobalFilter: true,
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
