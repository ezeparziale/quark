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
    <>
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {globalFilters ? (
          <div className="relative">
            <Input
              placeholder={`Filter ${searchFieldLabel}...`}
              type="text"
              value={filtering}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFiltering(e.target.value)
              }
              className="h-8 w-[150px] pr-8 lg:w-[250px]"
            />
            {filtering && (
              <Button
                variant="ghost"
                onClick={() => setFiltering("")}
                className="absolute top-1/2 right-2 h-6 -translate-y-1/2 transform has-[>svg]:px-1 has-[>svg]:py-0"
                aria-label="Clear search"
              >
                <X size={16} />
              </Button>
            )}
          </div>
        ) : (
          <DataTableHeaderFilters
            table={table}
            searchField={searchField!}
            searchFieldLabel={searchFieldLabel}
          />
        )}
        <div className="hidden sm:flex sm:flex-row sm:items-center sm:space-x-2">
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
      </div>
      {!hideTableViewOption && <DataTableViewOptions table={table} />}
    </div>
    <div className="flex sm:hidden flex-wrap gap-2">
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
    </>
  )
}
