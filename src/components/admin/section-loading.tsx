import { PageSection } from "../page-header"
import { Separator } from "../ui/separator"
import TableLoading from "./table-loading"

export default function SectionLoading() {
  return (
    <div className="space-y-6">
      <PageSection.Skeleton />
      <Separator className="my-6" />
      <TableLoading />
    </div>
  )
}
