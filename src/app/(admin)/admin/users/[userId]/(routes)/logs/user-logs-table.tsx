"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Logs } from "lucide-react"

import { ActivityType } from "@/schemas/activity-logs"

import { DataTable } from "@/components/ui/data-tables/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-tables/data-table-column-header"
import { DateCell } from "@/components/ui/data-tables/date-cell"
import EmptyState from "@/components/ui/data-tables/empty-state"

type ActivityLogsType = {
  id: number
  userId: number
  action: string
  createdAt: Date
}

const activityTypeOptions = Object.values(ActivityType).map((value) => ({
  label: value,
  value,
}))

export default function UserLogsTables({ data }: { data: ActivityLogsType[] }) {
  const columns: ColumnDef<ActivityLogsType>[] = [
    {
      header: "ID",
      accessorKey: "id",
      cell: ({ row }) => {
        return <div className="font-mono text-xs">{row.getValue("id")}</div>
      },
    },
    {
      accessorKey: "action",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Action" />,
      enableGlobalFilter: true,
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Logged At" />
      ),
      cell: ({ row }) => <DateCell date={row.original.createdAt} />,
    },
  ]
  return (
    <DataTable
      data={data}
      columns={columns}
      searchFieldLabel={"logs"}
      emptyState={
        <EmptyState
          icon={Logs}
          title="No logs found"
          description="It looks like there are no logs available yet."
        />
      }
      hideTableViewOption={true}
      filters={[
        {
          column: "action",
          title: "Actions",
          options: activityTypeOptions,
          isBoolean: false,
        },
      ]}
    />
  )
}
