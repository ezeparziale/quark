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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchField: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchField,
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 && !hasFiltersApplied ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No data available.
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="space-y-3 text-center">
                  <div className="flex items-center justify-center">
                    <Image
                      src={"/illustrations/no-results-light.svg"}
                      alt="no results"
                      width={250}
                      height={250}
                      className="block dark:hidden"
                    />
                    <Image
                      src={"/illustrations/no-results-dark.svg"}
                      alt="no results"
                      width={250}
                      height={250}
                      className="hidden dark:block"
                    />
                  </div>
                  <div>No results. Please try again.</div>
                  <Button onClick={clearSearch} variant={"default"} size={"sm"}>
                    Clear search
                  </Button>
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
