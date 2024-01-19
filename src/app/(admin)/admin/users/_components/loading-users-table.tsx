import { Skeleton } from "@/components/ui/skeleton"

export default function LoadingUsersTable() {
  return (
    <div className="flex w-full flex-col">
      <Skeleton className="h-64 w-auto" />
    </div>
  )
}
