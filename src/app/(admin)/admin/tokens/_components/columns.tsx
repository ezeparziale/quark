"use client"

import Link from "next/link"

import { type Token } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table"
import { format, formatDistanceToNow } from "date-fns"

import { Badge } from "@/components/ui/badge"
import { DataTableColumnHeader } from "@/components/ui/data-tables/data-table-column-header"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

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
