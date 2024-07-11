import prismadb from "@/lib/prismadb"

import { DataTable } from "@/components/ui/data-tables/data-table"

import { columns } from "./columns"
import UsersEmptyStateTable from "./users-empty-state-table"

export default async function UsersTable() {
  const data = await prismadb.user.findMany({ orderBy: { updatedAt: "desc" } })

  return (
    <DataTable
      columns={columns}
      data={data}
      searchField={"email"}
      searchFieldLabel={"emails"}
      emptyState={<UsersEmptyStateTable />}
      hiddenColumns={{ ID: false, "Created At": false, "Updated At": false }}
    />
  )
}
