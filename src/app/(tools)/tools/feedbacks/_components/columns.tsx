"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"

import { FEEDBACK_ITEMS } from "@/components/feedback-button"

import { DataTableColumnHeader } from "./data-table-column-header"

export interface IColumns {
  id: number
  userId: number
  feedback: string
  nps: number | null
  createdAt: Date
}

export const columns: ColumnDef<IColumns>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="#" />
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "feedback",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Feedback" />
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "nps",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="NPS" />
    },
    cell: ({ row }) => {
      const nps = FEEDBACK_ITEMS.find(
        (nps) => nps.value === String(row.getValue("nps")),
      )

      if (!nps) {
        return null
      }

      return (
        <div className="flex items-center justify-start">
          <span>{nps.value}</span>
          {nps.Icon && <nps.Icon className="ml-2 size-5" />}
        </div>
      )
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
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
    enableSorting: true,
    enableHiding: false,
  },
]
