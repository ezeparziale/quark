import { Skeleton } from "@/components/ui/skeleton"

export default function LoadingSettingsPage() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-[202px] w-full" />
      <Skeleton className="h-[202px] w-full" />
      <Skeleton className="h-[178px] w-full" />
    </div>
  )
}
