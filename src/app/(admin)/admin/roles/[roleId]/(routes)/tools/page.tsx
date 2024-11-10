import prismadb from "@/lib/prismadb"
import { protectPage } from "@/lib/rbac"

import { PageSection } from "@/components/page-header"

import ToolsSelect from "./_components/tools-select"

type Params = Promise<{ roleId: number }>

export default async function RolesAdminToolsPage(props: { params: Params }) {
  await protectPage({ permission: "admin:all" })

  const params = await props.params
  const roleId = Number(params.roleId)

  const data = await prismadb.role.findUnique({
    where: { id: roleId },
    include: { tools: { include: { tool: true } } },
  })

  const tools = await prismadb.tool.findMany()

  const toolSelected = data?.tools?.[0]?.toolId

  return (
    <>
      <PageSection title="Tools" description="Map tools to this role." />
      <ToolsSelect tools={tools} roleId={roleId} toolSelected={toolSelected} />
    </>
  )
}
