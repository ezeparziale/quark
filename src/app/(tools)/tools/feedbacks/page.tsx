import { Suspense } from "react"

import { Skeleton } from "@/components/ui/skeleton"

import { PageHeader } from "@/components/page-header"

import {
  IDataTableSearchParamsSSR,
  getSearchParamsSSR,
} from "./_components/data-table-utils-ssr"
import FeedbacksDataTableSSR from "./_components/feedbacks-table"

export default async function FeedbackPage({
  searchParams,
}: {
  searchParams: IDataTableSearchParamsSSR
}) {
  // Get params
  const defaultSort: string = "-createdAt"
  const { search, currentPage, limit, offset, orderBy, sortState } = getSearchParamsSSR(
    searchParams,
    defaultSort,
  )

  return (
    <>
      <PageHeader
        title="Feedback"
        description="View all feedback submitted by users."
      />
      <Suspense
        key={search ? search + currentPage : currentPage}
        fallback={<Skeleton className="h-64 w-auto" />}
      >
        <FeedbacksDataTableSSR
          search={search}
          currentPage={currentPage}
          sortState={sortState}
          limit={limit}
          offset={offset}
          orderBy={orderBy}
        />
      </Suspense>
    </>
  )
}
