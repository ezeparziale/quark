"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { useEffect, useState } from "react"

import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { SearchX } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { DataTableFiltersSSR } from "./data-filters-ssr"
import { DataTablePaginationSSR } from "./data-pagination-ssr"
import EmptyState from "./empty-state"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchField: string
  pageCount: number
  currentPage: number
  pageSize: number
  sortState: SortingState
  searchValue?: string
  emptyState: React.ReactNode
}

export function DataTableSSR<TData, TValue>({
  columns,
  data,
  searchField,
  pageCount,
  currentPage,
  pageSize,
  sortState,
  searchValue,
  emptyState,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>(sortState)
  const [mounted, setMounted] = useState<boolean>(false)

  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { replace } = useRouter()

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination: { pageIndex: currentPage - 1, pageSize },
      sorting,
    },
    pageCount,
    manualSorting: true,
    manualPagination: true,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
  })

  const handleSort = (sort: SortingState) => {
    const params = new URLSearchParams(searchParams)

    if (sort && sort.length > 0) {
      const sortOrder = sort.map(({ id, desc }) => (desc ? `-${id}` : id)).join(",")
      params.set("sort", sortOrder)
      params.delete("page")
    } else {
      params.delete("sort")
    }

    replace(`${pathname}?${params.toString()}`)
  }

  const handleClearSearch = () => {
    const params = new URLSearchParams(searchParams)

    params.delete("q")

    replace(`${pathname}?${params.toString()}`)
  }

  useEffect(() => {
    if (mounted) {
      handleSort(sorting)
    }
    setMounted(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting])

  if (data.length === 0 && !searchValue) {
    return (
      <div className="flex h-60 flex-1 items-center justify-center rounded-md border">
        {emptyState}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <DataTableFiltersSSR query={searchValue} searchField={searchField} />
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
                searchValue && (
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
                            onClick={handleClearSearch}
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
      <DataTablePaginationSSR
        table={table}
        pageCount={pageCount}
        currentPage={currentPage}
      />
    </div>
  )
}
