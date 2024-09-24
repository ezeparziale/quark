import { notFound } from "next/navigation"

import { protectPage } from "@/lib/rbac"

import { getUserById } from "@/data/user"

import { PageSection } from "@/components/page-header"

import EditUserForm from "./_components/edit-user-form"

export default async function UserAdminPage({
  params,
}: {
  params: { userId: number }
}) {
  await protectPage({ permission: "admin:all" })

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
