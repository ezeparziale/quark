import prismadb from "@/lib/prismadb"

import { DataTable } from "@/components/ui/data-tables/data-table"

import { columns } from "./columns"
import ToolsEmptyStateTable from "./tools-empty-state-table"

export default async function ToolsTable() {
  const data = await prismadb.tool.findMany({
    orderBy: { updatedAt: "desc" },
  })

  return (
    <DataTable
      columns={columns}
      data={data}
      searchField={"name"}
      searchFieldLabel={"names"}
      emptyState={<ToolsEmptyStateTable />}
      hiddenColumns={{ ID: false, "Created At": false, "Updated At": false }}
    />
  )
}
