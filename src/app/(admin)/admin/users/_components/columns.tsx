"use client"

import Link from "next/link"

import { type User } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { format, formatDistanceToNow } from "date-fns"
import { CheckCircle, Clock, Verified, XCircle } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { DataTableColumnHeader } from "@/components/ui/data-tables/data-table-column-header"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

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
    id: "Verified",
    accessorKey: "confirmedEmail",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Verified" />,
    cell: ({ row }) => {
      return (
        <Badge variant={row.original.confirmedEmail ? "green-subtle" : "purple-subtle"}>
          {row.original.confirmedEmail ? (
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
      )
    },
    enableGlobalFilter: true,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: "Active",
    accessorKey: "active",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Active" />,
    cell: ({ row }) => {
      return (
        <Badge variant={row.original.active ? "green-subtle" : "red-subtle"}>
          {row.original.active ? (
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
      )
    },
    enableGlobalFilter: true,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: "Created At",
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const createdAt = new Date(row.original.createdAt)
      const formattedDate = format(createdAt, "dd-MM-yyyy")
      const formattedTime = format(createdAt, "HH:mm:ss")
      const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true })

      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="text-xs">{timeAgo}</div>
          </TooltipTrigger>
          <TooltipContent>
            <div>{`${formattedDate} ${formattedTime}`}</div>
          </TooltipContent>
        </Tooltip>
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
      const updatedAt = new Date(row.original.updatedAt)
      const formattedDate = format(updatedAt, "dd-MM-yyyy")
      const formattedTime = format(updatedAt, "HH:mm:ss")
      const timeAgo = formatDistanceToNow(updatedAt, { addSuffix: true })

      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="text-xs">{timeAgo}</div>
          </TooltipTrigger>
          <TooltipContent>
            <div>{`${formattedDate} ${formattedTime}`}</div>
          </TooltipContent>
        </Tooltip>
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
