import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

export default function LoadingPage() {
  return (
    <div className="space-y-6">
      <Skeleton className="mb-6 h-8 w-16 p-0" />
      <div className="space-y-0.5">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="mt-[2px] h-6 w-96" />
      </div>
      <Separator className="my-6" />
      <div className="flex w-full flex-col space-y-8 md:w-2/3">
        <div>
          <Skeleton className="h-5 w-24" />
          <Skeleton className="mt-2 h-10 w-full" />
        </div>
        <div>
          <Skeleton className="h-5 w-24" />
          <Skeleton className="mt-2 h-10 w-full" />
        </div>
        <div>
          <Skeleton className="h-5 w-24" />
          <Skeleton className="mt-2 h-10 w-full" />
        </div>
        <div className="mt-4 flex flex-col space-y-4">
          <Skeleton className="h-9 w-full rounded-md px-3 md:w-1/5" />
          <Skeleton className="h-9 w-full rounded-md px-3 md:w-1/5" />
        </div>
      </div>
    </div>
  )
}
