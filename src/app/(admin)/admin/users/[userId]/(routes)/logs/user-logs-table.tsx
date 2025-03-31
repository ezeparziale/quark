"use client"

import { useState } from "react"

import type { ColumnDef } from "@tanstack/react-table"
import { ChevronDown, ChevronUp, LogInIcon as Logs } from "lucide-react"

import { ActivityType } from "@/schemas/activity-logs"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-tables/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-tables/data-table-column-header"
import { DateCell } from "@/components/ui/data-tables/date-cell"
import EmptyState from "@/components/ui/data-tables/empty-state"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

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
  const [selectedLogIndex, setSelectedLogIndex] = useState<number | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const handleRowClick = (log: ActivityLogsType) => {
    const index = data.findIndex((item) => item.id === log.id)
    setSelectedLogIndex(index)
    setIsSheetOpen(true)
  }

  const navigateLogs = (direction: "prev" | "next") => {
    if (selectedLogIndex === null || data.length === 0) return

    if (direction === "prev" && selectedLogIndex > 0) {
      setSelectedLogIndex(selectedLogIndex - 1)
    } else if (direction === "next" && selectedLogIndex < data.length - 1) {
      setSelectedLogIndex(selectedLogIndex + 1)
    }
  }

  const selectedLog = selectedLogIndex !== null ? data[selectedLogIndex] : null

  const columns: ColumnDef<ActivityLogsType>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" disableColumnHide />
      ),
      cell: ({ row }) => {
        return <div className="font-mono text-xs">{row.getValue("id")}</div>
      },
    },
    {
      accessorKey: "action",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Action" disableColumnHide />
      ),
      enableGlobalFilter: true,
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Logged At" disableColumnHide />
      ),
      cell: ({ row }) => <DateCell date={row.original.createdAt} />,
    },
  ]

  return (
    <>
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
        onRowClick={handleRowClick}
      />

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Log Details</SheetTitle>
            <SheetDescription>
              Detailed information about the selected log entry.
            </SheetDescription>
            <div className="absolute top-2 right-12 flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigateLogs("prev")}
                disabled={selectedLogIndex === 0 || selectedLogIndex === null}
                className="cursor-pointer"
              >
                <ChevronUp className="h-4 w-4" />
                <span className="sr-only">Previous log</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigateLogs("next")}
                disabled={
                  selectedLogIndex === data.length - 1 || selectedLogIndex === null
                }
                className="cursor-pointer"
              >
                <ChevronDown className="h-4 w-4" />
                <span className="sr-only">Next log</span>
              </Button>
            </div>
          </SheetHeader>
          {selectedLog && (
            <div className="space-y-5 p-4">
              <div className="space-y-2">
                <h4 className="text-muted-foreground text-sm font-medium">ID</h4>
                <p className="font-mono text-sm">{selectedLog.id}</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-muted-foreground text-sm font-medium">User ID</h4>
                <p className="font-mono text-sm">{selectedLog.userId}</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-muted-foreground text-sm font-medium">Action</h4>
                <p className="font-mono text-sm">{selectedLog.action}</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-muted-foreground text-sm font-medium">Timestamp</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-muted-foreground mb-1 block text-xs">
                      UTC Time:
                    </span>
                    <p className="font-mono text-sm">
                      {selectedLog.createdAt.toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "medium",
                        timeZone: "UTC",
                      })}
                    </p>
                  </div>

                  <div>
                    <span className="text-muted-foreground mb-1 block text-xs">
                      Local Time:
                    </span>
                    <p className="font-mono text-sm">
                      {selectedLog.createdAt.toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "medium",
                      })}
                    </p>
                  </div>

                  <div>
                    <span className="text-muted-foreground mb-1 block text-xs">
                      Timestamp:
                    </span>
                    <p className="font-mono text-sm">
                      {selectedLog.createdAt.getTime()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
