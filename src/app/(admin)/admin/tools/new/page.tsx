import { protectPage } from "@/lib/rbac"

import { PageHeader } from "@/components/page-header"

import ToolForm from "../_components/tool-form"

export default async function NewToolPage() {
  await protectPage({ permission: "admin:all" })

  return (
    <>
      <PageHeader
        title="Create new tool"
        description="Create a tool which can be assigned to your roles."
        linkBack="/admin/tools"
      />
      <ToolForm />
    </>
  )
}
