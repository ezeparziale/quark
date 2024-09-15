import { SortingState } from "@tanstack/react-table"
import { MessageSquareHeart } from "lucide-react"

import { getFeedbacksSSR } from "@/data/feedback"

import { columns } from "./columns"
import { DataTableSSR } from "./data-table-ssr"
import EmptyState from "./empty-state"

interface DataTableProps {
  currentPage: number
  sortState: SortingState
  search?: string
  limit: number
  offset: number
  orderBy: {
    [x: string]: string
  }[]
}

export default async function FeedbacksDataTableSSR({
  currentPage,
  sortState,
  search,
  limit,
  offset,
  orderBy,
}: DataTableProps) {
  // Get data
  const { data, pageCount } = await getFeedbacksSSR(offset, limit, orderBy, search)

  return (
    <DataTableSSR
      columns={columns}
      data={data}
      searchField={"feedback"}
      searchValue={search}
      pageCount={pageCount}
      currentPage={currentPage}
      pageSize={limit}
      sortState={sortState}
      emptyState={
        <EmptyState description="No feedback sent by users" icon={MessageSquareHeart} />
      }
    />
  )
}
