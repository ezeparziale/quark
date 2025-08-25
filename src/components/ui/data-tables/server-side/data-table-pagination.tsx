"use client"

import { useState } from "react"

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DataTablePaginationProps {
  currentPage: number
  pageCount: number
  pageSize: number
  totalCount: number
  totalCountFiltered: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export function DataTablePagination({
  currentPage,
  pageCount,
  pageSize,
  totalCount,
  totalCountFiltered,
  onPageChange,
  onPageSizeChange,
}: DataTablePaginationProps) {
  const [goToPage, setGoToPage] = useState("")

  const handleGoToPage = () => {
    const page = Number.parseInt(goToPage)
    if (page >= 1 && page <= pageCount) {
      onPageChange(page)
      setGoToPage("")
    }
  }

  return (
    <div className="flex items-center justify-between px-2">
      <div className="text-muted-foreground flex-1 text-sm">
        Page {currentPage} of {pageCount} ({totalCountFiltered} total)
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              onPageSizeChange(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Go to page:</p>
          <Input
            className="h-8 w-[70px]"
            value={goToPage}
            onChange={(e) => setGoToPage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleGoToPage()
              }
            }}
            placeholder="Page"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 bg-transparent p-0 lg:flex"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 bg-transparent p-0"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 bg-transparent p-0"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === pageCount}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 bg-transparent p-0 lg:flex"
            onClick={() => onPageChange(pageCount)}
            disabled={currentPage === pageCount}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
