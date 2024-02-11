import { notFound } from "next/navigation"

import prismadb from "@/lib/prismadb"
import { NavItem } from "@/types/types"

import { SidebarNav } from "@/components/admin/sidebar-nav"
import { PageHeader } from "@/components/page-header"

import DeleteUserModal from "./_components/delete-user-modal"

const getSideBarNavItems = (id: string): NavItem[] => {
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
  const copy = `${user.id}`
  const linkBack = "/admin/users"

  return (
    <>
      <PageHeader
        title={title}
        description={description}
        linkBack={linkBack}
        copy={copy}
        action={<DeleteUserModal user={user} />}
      />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1">{children}</div>
      </div>
    </>
  )
}
