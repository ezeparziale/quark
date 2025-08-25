"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"

import type { Token } from "@/types/token"

import { Badge } from "@/components/ui/badge"
import { DataTableColumnHeader } from "@/components/ui/data-tables/server-side/data-table-column-header"

import { TokenActionsCell } from "./cell-actions"

export const columns: ColumnDef<Token>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "partialToken",
    header: "Token",
    cell: ({ row }) => (
      <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm">
        {row.getValue("partialToken")}
      </code>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as string
      return (
        <Badge variant={type === "inherit" ? "secondary" : "default"}>{type}</Badge>
      )
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean
      return (
        <Badge variant={isActive ? "green-subtle" : "red-subtle"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      )
    },
  },
  {
    accessorKey: "lastUsed",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Last Used" />,
    cell: ({ row }) => {
      const lastUsed = row.getValue("lastUsed") as string
      return lastUsed ? format(new Date(lastUsed), "MMM dd, yyyy HH:mm") : "Never"
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string
      return format(new Date(createdAt), "MMM dd, yyyy")
    },
    enableHiding: true,
  },
  {
    accessorKey: "expires",
    header: "Expires",
    cell: ({ row }) => {
      const expires = row.getValue("expires") as string | null
      return expires ? format(new Date(expires), "MMM dd, yyyy") : "Never"
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <TokenActionsCell token={row.original} />,
  },
]
