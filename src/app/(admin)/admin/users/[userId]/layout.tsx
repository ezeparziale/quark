import { notFound } from "next/navigation"

import prismadb from "@/utils/prismadb"

import BackButtonLink from "@/components/back-button-link"
import { CopyButtonData } from "@/components/copy-clipboard-button"
import { Separator } from "@/components/ui/separator"

import DeleteUserModal from "./_components/delete-user-modal"
import { SidebarNav } from "./_components/sidebar-nav"

const getSideBarNavItems = (id: string) => {
  const baseHref = `/admin/users/${id}`

  return [
    {
      title: "Settings",
      href: `${baseHref}`,
      type: "parent",
    },
    {
      title: "Roles",
      href: `${baseHref}/roles`,
      type: "child",
    },
  ]
}

interface SettingsLayoutProps {
  children: React.ReactNode
  params: { userId: string }
}

export default async function SettingsLayout({
  children,
  params,
}: SettingsLayoutProps) {
  const sidebarNavItems = getSideBarNavItems(params.userId)

  const getUser = async () => {
    const id = params.userId

    if (!id) {
      return notFound()
    }

    const user = await prismadb.user.findUnique({
      where: { id },
    })

    if (!user) {
      return notFound()
    }

    return user
  }

  const user = await getUser()

  const title = `Edit user ${user?.email}`
  const description = `ID: ${user?.id}`

  return (
    <>
      <BackButtonLink link={"/admin/users"} />
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <div className="flex items-center justify-start">
            <p className="text-muted-foreground">{description}</p>
            <CopyButtonData textToCopy={params.userId} />
          </div>
        </div>
        <DeleteUserModal user={user} />
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1">{children}</div>
      </div>
    </>
  )
}
