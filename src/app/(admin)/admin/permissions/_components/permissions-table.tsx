import { getAllPermissions } from "@/data/permission"

import { DataTable } from "@/components/ui/data-tables/data-table"

import { columns } from "./columns"
import PermissionsEmptyStateTable from "./permissions-empty-state-table"

export default async function PermissionsTable() {
  const data = await getAllPermissions()

  return (
    <DataTable
      columns={columns}
      data={data}
      searchField={"name"}
      searchFieldLabel={"names"}
      emptyState={<PermissionsEmptyStateTable />}
      hiddenColumns={{ ID: false, "Created At": false, "Updated At": false }}
    />
  )
}
