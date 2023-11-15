import { notFound } from "next/navigation"

import { withRoles } from "@/lib/rbac"
import prismadb from "@/utils/prismadb"

import { Separator } from "@/components/ui/separator"

import UserForm from "../../_components/user-form"

const UserAdminPage = async ({ params }: { params: { userId: string } }) => {
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

export default withRoles(UserAdminPage, ["admin:all"])
