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
        <p className="text-sm font-medium">Show</p>
        <Select
          defaultValue="10"
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => {
            table.setPageSize(Number(value))
          }}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={table.getState().pagination.pageSize} />
          </SelectTrigger>
          <SelectContent>
            {[10, 25, 50, 100].map((pageSize) => (
              <SelectItem key={pageSize} value={`${pageSize}`}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm font-medium">entries</p>
      </div>
      <Input
        placeholder="Filter"
        value={(table.getColumn(searchField)?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn(searchField)?.setFilterValue(event.target.value)
        }
        className="h-8 w-[150px] lg:w-[250px]"
      />
    </div>
  )
}
