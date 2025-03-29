import prismadb from "@/lib/prismadb"
import { protectPage } from "@/lib/rbac"

import { PageSection } from "@/components/page-header"

import UserLogsTables from "./user-logs-table"

type Params = Promise<{ userId: number }>

export default async function UserLogsPage(props: { params: Params }) {
  await protectPage({ permission: "admin:all" })

  const params = await props.params
  const userId = Number(params.userId)

  const data = await prismadb.activityLog.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })

  return (
    <>
      <PageSection title="Logs" description="View user logs." />
      <UserLogsTables data={data} />
    </>
  )
}
