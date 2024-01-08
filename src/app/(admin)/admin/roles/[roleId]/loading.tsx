import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

export default function LoadingPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-0.5">
        <Skeleton className="h-[28px] w-64" />
        <Skeleton className="mt-[2px] h-[20px] w-96" />
      </div>
      <Separator className="my-6" />
      <div className="flex w-full flex-col space-y-8 md:w-2/3">
        <div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  )
}
