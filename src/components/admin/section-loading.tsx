import { Skeleton } from "@/components/ui/skeleton"

import { Separator } from "../ui/separator"
import TableLoading from "./table-loading"

export default function SectionLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-0.5">
        <Skeleton className="h-[28px] w-64" />
        <Skeleton className="h-[20px] w-96" />
      </div>
      <Separator className="my-6" />
      <TableLoading />
    </div>
  )
}
