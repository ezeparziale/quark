import { notFound } from "next/navigation"

import { getUserById } from "@/data/user"
import { protectPage } from "@/lib/rbac"

import { PageSection } from "@/components/page-header"

import UserForm from "../_components/user-form"

export default async function UserAdminPage({
  params,
}: {
  params: { userId: string }
}) {
  await protectPage({ permission: "admin:all" })

  const { userId } = params

  const user = await getUserById(userId)

  if (!user) {
    return notFound()
  }

  return (
    <>
      <PageSection title="Settings" description="Manage user settings." />
      <UserForm user={user} />
    </>
  )
}
