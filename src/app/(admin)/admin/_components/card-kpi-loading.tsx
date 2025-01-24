import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function CardKpiLoading() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 space-x-2 pb-2">
        <Skeleton className="h-[20px] w-[100px]" />
        <Skeleton className="size-6" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-20" />
      </CardContent>
    </Card>
  )
}
