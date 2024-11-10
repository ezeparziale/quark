import { notFound } from "next/navigation"

import { protectPage } from "@/lib/rbac"

import { getToolById } from "@/data/tools"

import { PageHeader } from "@/components/page-header"

import DeleteToolButton from "../_components/delete-tool-button"
import ToolForm from "../_components/tool-form"

type Params = Promise<{ toolId: number }>

export default async function EditToolPage(props: { params: Params }) {
  await protectPage({ permission: "admin:all" })

  const params = await props.params
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
        actions={<DeleteToolButton toolId={tool.id} toolName={tool.name} />}
      />
      <ToolForm tool={tool} />
    </>
  )
}
