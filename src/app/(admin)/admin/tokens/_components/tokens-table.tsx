import prismadb from "@/lib/prismadb"

import { DataTable } from "@/components/ui/data-tables/data-table"

import { columns } from "./columns"
import TokensEmptyStateTable from "./tokens-empty-state-table"

export default async function TokensTable() {
  const data = await prismadb.token.findMany({
    include: { user: { select: { id: true, username: true, image: true } } },
    orderBy: { createdAt: "desc" },
  })

  return (
    <DataTable
      columns={columns}
      data={data}
      searchFieldLabel={"tokens"}
      emptyState={<TokensEmptyStateTable />}
      hiddenColumns={{ "Updated At": false }}
    />
  )
}
