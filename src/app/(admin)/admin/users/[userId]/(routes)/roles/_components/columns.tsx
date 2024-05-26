"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"

import CellActions from "./cell-actions"

export interface IColumns {
  userId: number
  roleId: number
  role: {
    id: number
    name: string
  }
}

export const columns: ColumnDef<IColumns>[] = [
  {
    id: "name",
    accessorKey: "role.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Role
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
