import prismadb from "@/lib/prismadb"

import { DataTable } from "@/components/ui/data-tables/data-table"

import { columns } from "./columns"
import PermissionsEmptyStateTable from "./permissions-empty-state-table"

export default async function PermissionsTable() {
  const data = await prismadb.permission.findMany({
    orderBy: { updatedAt: "desc" },
  })

  return (
    <DataTable
      columns={columns}
      data={data}
      searchField={"name"}
      emptyState={<PermissionsEmptyStateTable />}
    />
  )
}
