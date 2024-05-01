"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import CellActions from "./cell-actions"

export type IColumns =
  | ({
      permission: {
        id: number
        name: string
        description: string
        key: string
        createdAt: Date
        updatedAt: Date
      }
    } & {
      permissionId: number
      roleId: number
      createdAt: Date
    })
  | undefined

export const columns: ColumnDef<IColumns>[] = [
  {
    id: "permission.name",
    accessorKey: "permission.name",
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
    accessorKey: "permission.description",
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
    accessorKey: "permission.key",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Key
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
    cell: ({ row }) => {
      return <Badge variant={"secondary"}>{row.original?.permission.key}</Badge>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <CellActions row={row.original} />
    },
  },
]
