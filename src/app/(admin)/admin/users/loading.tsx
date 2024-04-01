import TableLoading from "@/components/admin/table-loading"
import { PageHeader } from "@/components/page-header"

export default function LoadingUsersAdminPage() {
  return (
    <>
      <PageHeader.Skeleton />
      <TableLoading />
    </>
  )
}
