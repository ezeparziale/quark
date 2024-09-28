import { Skeleton } from "@/components/ui/skeleton"

import { PageHeader } from "@/components/page-header"

export default function LoadingCreateUserPage() {
  return (
    <div className="space-y-6">
      <Skeleton className="mb-6 h-8 w-16 p-0" />
      <PageHeader.Skeleton />
      <div className="mt-8 flex w-full flex-col space-y-8 md:w-2/3">
        <div className="flex gap-x-4">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-12" />
            <div className="flex h-10 items-center justify-center">
              <Skeleton className="h-6 w-11 rounded-full" />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="space-y-9">
          <div className="flex flex-row items-center justify-between rounded-lg border p-5">
            <div className="space-y-0.5">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-5 w-64" />
            </div>
            <Skeleton className="h-6 w-11 rounded-full" />
          </div>
          <div className="flex flex-row items-center justify-between rounded-lg border p-5">
            <div className="space-y-0.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-64" />
            </div>
            <Skeleton className="h-6 w-11 rounded-full" />
          </div>
        </div>
        <div className="flex flex-col space-y-4">
          <Skeleton className="h-9 w-full md:w-1/5" />
          <Skeleton className="h-9 w-full md:w-1/5" />
        </div>
      </div>
    </div>
  )
}
