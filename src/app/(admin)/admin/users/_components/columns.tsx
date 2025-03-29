"use client"

import Link from "next/link"

import { type User } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { CheckCircle, Clock, Verified, XCircle } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DataTableColumnHeader } from "@/components/ui/data-tables/data-table-column-header"
import { DateCell } from "@/components/ui/data-tables/date-cell"

import CellActions from "./cell-actions"

export type IColumns = Pick<
  User,
  | "id"
  | "email"
  | "username"
  | "isActive"
  | "isAdmin"
  | "image"
  | "emailVerified"
  | "createdAt"
  | "updatedAt"
>

export const columns: ColumnDef<IColumns>[] = [
  {
    id: "avatar",
    accessorKey: "image",
    header: "Avatar",
    cell: ({ row }) => (
      <Avatar className="size-8">
        <AvatarImage
          src={row.original.image ?? undefined}
          alt={`Avatar of ${row.original.username}`}
        />
        <AvatarFallback>{row.original.username.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => (
      <Link href={`/admin/users/${row.original.id}`}>{row.original.email}</Link>
    ),
    enableGlobalFilter: true,
  },
  {
    accessorKey: "username",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Username" />,
    enableGlobalFilter: true,
  },
  {
    id: "Role",
    accessorKey: "isAdmin",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
    cell: ({ row }) => (
      <Badge variant={row.original.isAdmin ? "blue-subtle" : "amber-subtle"}>
        {row.original.isAdmin ? "Admin" : "User"}
      </Badge>
    ),
    enableGlobalFilter: true,
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    id: "Verified",
    accessorKey: "emailVerified",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Verified" />,
    cell: ({ row }) => (
      <Badge variant={row.original.emailVerified ? "green-subtle" : "purple-subtle"}>
        {row.original.emailVerified ? (
          <>
            <Verified size={16} className="mr-1" />
            Verified
          </>
        ) : (
          <>
            <Clock size={16} className="mr-1" />
            Pending
          </>
        )}
      </Badge>
    ),
    enableGlobalFilter: true,
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
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
    cell: ({ row }) => <CellActions row={row.original} />,
  },
]
