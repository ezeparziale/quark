import { notFound } from "next/navigation"

import { protectPage } from "@/lib/rbac"

import { getUserById } from "@/data/user"

import { PageSection } from "@/components/page-header"

import EditUserForm from "./_components/edit-user-form"

type Params = Promise<{ userId: number }>

export default async function UserAdminPage(props: { params: Params }) {
  await protectPage({ permission: "admin:all" })

  const params = await props.params
  const userId = Number(params.userId)

  const user = await getUserById(userId)

  if (!user) {
    return notFound()
  }

  return (
    <>
      <PageSection title="Settings" description="Manage user settings." />
      <EditUserForm user={user} />
    </>
  )
}
