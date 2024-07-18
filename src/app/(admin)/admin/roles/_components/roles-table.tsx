import prismadb from "@/lib/prismadb"

import { DataTable } from "@/components/ui/data-tables/data-table"

import { columns } from "./columns"
import RolesEmptyStateTable from "./roles-empty-state-table"

export default async function RolesTable() {
  const data = await prismadb.role.findMany({ orderBy: { updatedAt: "desc" } })

  return (
    <DataTable
      columns={columns}
      data={data}
      searchFieldLabel={"roles"}
      emptyState={<RolesEmptyStateTable />}
      hiddenColumns={{ ID: false, "Created At": false, "Updated At": false }}
    />
  )
}
