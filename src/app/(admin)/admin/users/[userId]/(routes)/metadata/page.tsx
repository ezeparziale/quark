import { notFound } from "next/navigation"

import prismadb from "@/lib/prismadb"
import { protectPage } from "@/lib/rbac"

import { PageSection } from "@/components/page-header"

import { MetadataEditor } from "./_components/metadata-editor"

type Params = Promise<{ userId: number }>

export default async function UserMetadataPage(props: { params: Params }) {
  await protectPage({ permission: "admin:all" })

  const params = await props.params
  const userId = Number(params.userId)

  const user = await prismadb.user.findUnique({
    select: { id: true, userMetadata: { select: { metadata: true } } },
    where: { id: userId },
  })

  if (!user) notFound()

  const metadata = JSON.stringify(user.userMetadata?.metadata || {}, null, 2)

  return (
    <>
      <PageSection title="Metadata" description="Manage and update user metadata." />
      <MetadataEditor userId={userId} userMetadata={metadata} />
    </>
  )
}
