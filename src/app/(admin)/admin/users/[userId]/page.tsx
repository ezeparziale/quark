import { notFound } from "next/navigation"

import prismadb from "@/lib/prismadb"
import { protectPage } from "@/lib/rbac"

import { PageSection } from "@/components/page-header"

import UserForm from "../_components/create-user-form"

export default async function UserAdminPage({
  params,
}: {
  params: { userId: string }
}) {
  await protectPage({ permission: "admin:all" })

  const getUser = async () => {
    const id = params.userId

    const user = await prismadb.user.findUnique({
      where: { id },
    })

    if (!user) {
      return notFound()
    }

    return user
  }

  const user = await getUser()

  const title = "Settings"
  const description = "Manage user settings"

  return (
    <>
      <PageSection title={title} description={description} />
      <UserForm user={user} />
    </>
  )
}
