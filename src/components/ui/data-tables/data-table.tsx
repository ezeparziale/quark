"use client"

import Image from "next/image"

import { useState } from "react"

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { SearchX } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "../button"
import { DataTableHeaderFilters } from "./data-table-filters"
import { DataTablePagination } from "./data-table-pagination"
import EmptyState from "./empty-state"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchField: string
  emptyState?: React.ReactNode
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchField,
  emptyState,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
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
      <DataTableHeaderFilters table={table} searchField={searchField} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
                            className="my-4"
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
