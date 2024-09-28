import { redirect } from "next/navigation"

import { Suspense } from "react"

import { auth } from "@/auth"

import { protectPage } from "@/lib/rbac"

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
  const session = await auth()

  if (!session) {
    redirect("/auth/login?callbackUrl=/tools/feedbacks")
  }

  await protectPage({ permission: "feedbacks:view" })

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