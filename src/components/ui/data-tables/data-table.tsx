"use client"

import { useState } from "react"

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { SearchX } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DataTableHeaderFilters } from "@/components/ui/data-tables/data-table-filters"
import { DataTablePagination } from "@/components/ui/data-tables/data-table-pagination"
import { DataTableViewOptions } from "@/components/ui/data-tables/data-table-view-options"
import EmptyState from "@/components/ui/data-tables/empty-state"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchField: string
  searchFieldLabel?: string
  emptyState?: React.ReactNode
  hiddenColumns?: {[x: string]: boolean}
  hideTableViewOption?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchField,
  searchFieldLabel,
  emptyState,
  hiddenColumns,
  hideTableViewOption = false
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(hiddenColumns ?? {})
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  const clearSearch = () => {
    setColumnFilters([])
  }

  const hasFiltersApplied = columnFilters.length > 0

  if (data.length === 0 && !hasFiltersApplied) {
    return (
      <div className="flex h-60 flex-1 items-center justify-center rounded-md border">
        {emptyState ? emptyState : <EmptyState />}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <DataTableHeaderFilters table={table} searchField={searchField} searchFieldLabel={searchFieldLabel}/>
        {!hideTableViewOption && <DataTableViewOptions table={table} />}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length
              ? table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : getFilteredRowModel.length === 0 &&
                hasFiltersApplied && (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="space-y-3 text-center"
                    >
                      <EmptyState
                        title="No results found"
                        description="Please try again"
                        icon={SearchX}
                        action={
                          <Button
                            onClick={clearSearch}
                            variant={"default"}
                            size={"sm"}
                            className="mb-4"
                          >
                            Clear search
                          </Button>
                        }
                      />
                    </TableCell>
                  </TableRow>
                )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
