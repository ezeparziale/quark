import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { Table } from "@tanstack/react-table"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  pageCount: number
  currentPage: number
}

export function DataTablePaginationSSR<TData>({
  table,
  pageCount,
  currentPage,
}: DataTablePaginationProps<TData>) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { replace } = useRouter()

  const handleGotoPage = (page: string) => {
    const params = new URLSearchParams(searchParams)
    if (page) {
      params.set("page", page)
    } else {
      params.delete("page")
    }
    replace(`${pathname}?${params.toString()}`)
  }

  const handlePageSize = (per_page: string) => {
    const params = new URLSearchParams(searchParams)
    if (per_page) {
      params.set("per_page", per_page)
    } else {
      params.delete("per_page")
    }
    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center space-x-2">
        <div className="flex w-[100px] items-center justify-start text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <span className="hidden items-center justify-start gap-1 text-sm font-medium sm:flex">
          Go to page:
          <Input
            type="number"
            min="1"
            max={pageCount}
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              let page = e.target.value ? Number(e.target.value) : 1
              if (page < 1) {
                page = 1
              } else if (page > pageCount) {
                page = pageCount
              }
              handleGotoPage(String(page))
            }}
            className="h-8 w-16"
          />
        </span>
      </div>
      <div className="flex items-center space-x-4">
        <div className="hidden items-center space-x-2 sm:flex">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            defaultValue={`${table.getState().pagination.pageSize}`}
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              handlePageSize(value)
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 25, 50, 100].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => handleGotoPage("1")}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => handleGotoPage(String(currentPage - 1))}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => handleGotoPage(String(currentPage + 1))}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => handleGotoPage(String(table.getPageCount()))}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
