import prismadb from "@/utils/prismadb"

import { DataTable } from "@/components/ui/data-tables/data-table"

import { columns } from "./columns"

export default async function UsersTable() {
  const data = await prismadb.user.findMany({ orderBy: { updatedAt: "desc" } })

  return <DataTable columns={columns} data={data} searchField={"email"} />
}
