import { Table } from "@tanstack/react-table"

import { Input } from "../input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select"

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  searchField: string
}

export function DataTableHeaderFilters<TData>({
  table,
  searchField,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center space-x-2">
        <span>Show</span>
        <Select
          defaultValue="10"
          value={table.getState().pagination.pageSize as unknown as string}
          onValueChange={(e) => {
            table.setPageSize(Number(e))
          }}
        >
          <SelectTrigger className="w-[70px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[10, 25, 50, 100].map((pageSize) => (
              <SelectItem key={pageSize} value={pageSize as unknown as string}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span>entries</span>
      </div>
      <Input
        placeholder="Filter"
        value={(table.getColumn(searchField)?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn(searchField)?.setFilterValue(event.target.value)
        }
        className="max-w-sm"
      />
    </div>
  )
}
