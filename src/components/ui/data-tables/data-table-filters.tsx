import { Table } from "@tanstack/react-table"
import { X } from "lucide-react"

import { Button } from "../button"
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
  const column = table.getColumn(searchField)
  const filterValue = (column?.getFilterValue() as string) ?? ""

  return (
    <div className="relative flex items-center justify-between">
      <Input
        placeholder={`Filter ${searchFieldLabel}...`}
        value={filterValue}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          column?.setFilterValue(e.target.value)
        }
        className="h-8 w-[150px] pr-8 lg:w-[250px]"
      />
      {filterValue && (
        <Button
          variant="ghost"
          onClick={() => column?.setFilterValue("")}
          className="absolute top-1/2 right-2 h-6 -translate-y-1/2 transform has-[>svg]:px-1 has-[>svg]:py-0"
          aria-label="Clear search"
        >
          <X size={16} />
        </Button>
      )}
    </div>
  )
}
