"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"

import CellActions from "./cell-actions"

export interface IColumns {
  id: number
  name: string
  description: string
}

export const columns: ColumnDef<IColumns>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
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
    accessorKey: "description",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Description
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
