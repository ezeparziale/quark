import TableLoading from "@/components/admin/table-loading"
import { PageHeader } from "@/components/page-header"

export default function LoadingRolesAdminPage() {
  return (
    <>
      <PageHeader.Skeleton />
      <TableLoading />
    </>
  )
}
