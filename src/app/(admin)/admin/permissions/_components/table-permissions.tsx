import prismadb from "@/utils/prismadb"

import { DataTable } from "@/components/ui/data-tables/data-table"

import { columns } from "./columns"

export default async function TablePermissions() {
  const data = await prismadb.permission.findMany({ orderBy: { updatedAt: "desc" } })

  return <DataTable columns={columns} data={data} searchField={"name"} />
}
