import { Skeleton } from "@/components/ui/skeleton"

import { PageHeader } from "@/components/page-header"

export default function LoadingEditToolPage() {
  return (
    <div className="space-y-6">
      <Skeleton className="mb-6 h-8 w-16 p-0" />
      <PageHeader.Skeleton />
      <div className="mt-6 flex w-full flex-col space-y-4 md:w-2/3">
        <div className="space-y-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="mt-4 flex flex-col space-y-4">
          <Skeleton className="h-9 w-full md:w-1/5" />
          <Skeleton className="h-9 w-full md:w-1/5" />
        </div>
      </div>
    </div>
  )
}
