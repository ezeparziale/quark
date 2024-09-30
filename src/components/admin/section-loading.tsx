import { PageSection } from "../page-header"
import TableLoading from "./table-loading"

export default function SectionLoading() {
  return (
    <>
      <PageSection.Skeleton />
      <TableLoading />
    </>
  )
}
