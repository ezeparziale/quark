import { Dispatch, SetStateAction } from "react"

import { Column, Table } from "@tanstack/react-table"
import { LucideIcon, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { DataTableHeaderFilters } from "./data-table-filters"
import { DataTableViewOptions } from "./data-table-view-options"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  filters: {
    column: string
    title: string
    options: {
      label: string
      value: string
      icon?: LucideIcon
    }[]
    isBoolean?: boolean
  }[]
  filtering: string
  setFiltering: Dispatch<SetStateAction<string>>
  searchFieldLabel?: string
  searchField?: string
  hideTableViewOption?: boolean
  globalFilters?: boolean
}

export function DataTableToolbar<TData>({
  table,
  filters,
  filtering,
  setFiltering,
  searchFieldLabel,
  searchField,
  hideTableViewOption = false,
  globalFilters = true,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {globalFilters ? (
          <Input
            placeholder={`Filter ${searchFieldLabel}...`}
            type="text"
            value={filtering}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFiltering(e.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />
        ) : (
          <DataTableHeaderFilters
            table={table}
            searchField={searchField!}
            searchFieldLabel={searchFieldLabel}
          />
        )}
        {filters.map((filter) => {
          const column = table.getColumn(filter.column) as Column<TData>

          if (!column) return null

          return (
            <DataTableFacetedFilter
              key={filter.column}
              column={column}
              title={filter.title}
              options={filter.options}
              isBoolean={filter.isBoolean}
            />
          )
        })}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      {!hideTableViewOption && <DataTableViewOptions table={table} />}
    </div>
  )
}
