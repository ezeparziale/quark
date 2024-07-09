import { Table } from "@tanstack/react-table"

import { Input } from "../input"

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  searchField: string
  searchFieldLabel?: string
}

export function DataTableHeaderFilters<TData>({
  table,
  searchField,
  searchFieldLabel = "",
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-between">
      <Input
        placeholder={`Filter ${searchFieldLabel}...`}
        value={(table.getColumn(searchField)?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn(searchField)?.setFilterValue(event.target.value)
        }
        className="h-8 w-[150px] lg:w-[250px]"
      />
    </div>
  )
}
