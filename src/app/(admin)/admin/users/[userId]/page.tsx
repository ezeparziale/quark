import { notFound } from "next/navigation"

import { protectPage } from "@/lib/rbac"
import prismadb from "@/utils/prismadb"

import PageAdminHeader from "@/components/admin/page-admin-header"

import UserForm from "../_components/user-form"

export default async function UserAdminPage({
  params,
}: {
  params: { userId: string }
}) {
  await protectPage(["admin:all"])

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
    <PageAdminHeader title={title} description={description}>
      <UserForm user={user} />
    </PageAdminHeader>
  )
}
