import { notFound } from "next/navigation"

import { protectPage } from "@/lib/rbac"
import prismadb from "@/utils/prismadb"

import { Separator } from "@/components/ui/separator"

import UserForm from "../../_components/user-form"

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

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-lg font-medium">Settings</h3>
            <p className="text-sm text-muted-foreground">Manage user settings</p>
          </div>
        </div>
        <Separator />
        <UserForm user={user} />
      </div>
    </>
  )
}
