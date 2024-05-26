"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"

import CellActions from "./cell-actions"

export interface IColumns {
  userId: number
  roleId: number
  user: {
    id: number
    email: string
  }
}

export const columns: ColumnDef<IColumns>[] = [
  {
    id: "email",
    accessorKey: "user.email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          {column.getIsSorted() === false ? (
            <ArrowUpDown className="ml-2 size-4" />
          ) : column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 size-4" />
          ) : (
            <ArrowDown className="ml-2 size-4" />
          )}
        </Button>
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
