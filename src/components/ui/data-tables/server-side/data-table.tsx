"use client"

import { useEffect, useState } from "react"

import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Plus, Search } from "lucide-react"

import { TableParams } from "@/types/token"

import { useDebounce } from "@/lib/hooks/use-debounce"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "../../button"
import EmptyState from "../empty-state"
import { DataTableColumnToggle } from "./data-table-column-toggle"
import { DataTablePagination } from "./data-table-pagination"
import { DataTableSearch } from "./data-table-search"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  totalCount: number
  totalCountFiltered: number
  pageCount: number
  loading?: boolean
  params: TableParams
  onParamsChange: (params: TableParams) => void
  searchPlaceholder?: string
  defaultHiddenColumns?: Record<string, boolean>
  defaultSorting?: SortingState
  enableSearch?: boolean
  enableColumnToggle?: boolean
  emptyStateTitle?: string
  emptyStateDescription?: string
  onCreateNew?: () => void
  createButtonText?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  totalCount,
  totalCountFiltered,
  pageCount,
  loading = false,
  params,
  onParamsChange,
  searchPlaceholder = "Search...",
  defaultHiddenColumns = {},
  defaultSorting = [],
  enableSearch = true,
  enableColumnToggle = true,
  emptyStateTitle,
  emptyStateDescription,
  onCreateNew,
  createButtonText = "Create New",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>(defaultSorting)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>(defaultHiddenColumns)
  const [searchValue, setSearchValue] = useState(params.search)

  const debouncedSearch = useDebounce(searchValue, 500)

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  })

  useEffect(() => {
    if (debouncedSearch !== params.search) {
      onParamsChange({
        ...params,
        search: debouncedSearch,
        page: 1,
      })
    }
  }, [debouncedSearch, params, onParamsChange])

  useEffect(() => {
    if (sorting.length > 0) {
      const sortString = sorting
        .map((sort) => `${sort.desc ? "-" : ""}${sort.id}`)
        .join(",")

      if (sortString !== params.sort) {
        onParamsChange({
          ...params,
          sort: sortString,
        })
      }
    } else if (params.sort) {
      onParamsChange({
        ...params,
        sort: "",
      })
    }
  }, [sorting, params, onParamsChange])

  const handlePageChange = (page: number) => {
    onParamsChange({
      ...params,
      page,
    })
  }

  const handlePageSizeChange = (pageSize: number) => {
    onParamsChange({
      ...params,
      limit: pageSize,
      page: 1,
    })
  }

  const handleClearSearch = () => {
    setSearchValue("")
    onParamsChange({
      ...params,
      search: "",
      page: 1,
    })
  }

  const hasActiveSearch = params.search && params.search.trim() !== ""

  return (
    <div className="w-full">
      {(enableSearch || enableColumnToggle) && (
        <div className="flex items-center py-4">
          {enableSearch && (
            <DataTableSearch
              value={searchValue}
              onChange={setSearchValue}
              placeholder={searchPlaceholder}
            />
          )}
          {enableColumnToggle && <DataTableColumnToggle table={table} />}
        </div>
      )}
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-96">
                  <EmptyState
                    title={
                      hasActiveSearch
                        ? "No results found"
                        : emptyStateTitle || "No data available"
                    }
                    description={
                      hasActiveSearch
                        ? `No results found for "${params.search}". Try adjusting your search.`
                        : emptyStateDescription || "You can add new data to get started"
                    }
                    icon={hasActiveSearch ? Search : Plus}
                    action={
                      hasActiveSearch ? (
                        <Button variant="outline" onClick={handleClearSearch}>
                          Clear search
                        </Button>
                      ) : onCreateNew ? (
                        <Button onClick={onCreateNew}>{createButtonText}</Button>
                      ) : null
                    }
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="py-4">
        <DataTablePagination
          currentPage={params.page}
          pageCount={pageCount}
          pageSize={params.limit}
          totalCount={totalCount}
          totalCountFiltered={totalCountFiltered}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  )
}
