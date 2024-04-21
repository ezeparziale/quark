import { notFound } from "next/navigation"

import { getToolById } from "@/data/tools"
import { protectPage } from "@/lib/rbac"

import { PageHeader } from "@/components/page-header"

import DeleteToolModal from "../_components/delete-tool-modal"
import ToolForm from "../_components/tool-form"

export default async function EditToolPage({ params }: { params: { toolId: number } }) {
  await protectPage({ permission: "admin:all" })

  const id = Number(params.toolId)

  if (!id) {
    return notFound()
  }

  const tool = await getToolById(id)

  if (!tool) {
    return notFound()
  }

  return (
    <>
      <PageHeader
        title={`Edit tool ${tool.name}`}
        description={`ID: ${tool.id}`}
        linkBack={"/admin/tools"}
        copy={String(`${tool.id}`)}
        actions={<DeleteToolModal tool={tool} />}
      />
      <ToolForm tool={tool} />
    </>
  )
}
