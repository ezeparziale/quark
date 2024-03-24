import React from "react"

import TableLoading from "@/components/admin/table-loading"
import { PageHeader } from "@/components/page-header"

export default function LoadingPermissions() {
  return (
    <>
      <PageHeader.Skeleton />
      <TableLoading />
    </>
  )
}
