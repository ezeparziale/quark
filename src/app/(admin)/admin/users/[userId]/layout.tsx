import { notFound } from "next/navigation"

import { NavItem } from "@/types/types"

import { getUserById } from "@/data/user"

import { SidebarNav } from "@/components/admin/sidebar-nav"
import { PageHeader } from "@/components/page-header"

import DeleteUserButton from "./_components/delete-user-button"

const getSideBarNavItems = (id: number): NavItem[] => {
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

type Params = Promise<{ userId: number }>

export default async function SettingsLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Params
}) {
  const userId = Number((await params).userId)

  const sidebarNavItems = getSideBarNavItems(userId)

  if (!userId) {
    return notFound()
  }

  const user = await getUserById(userId)

  if (!user) {
    return notFound()
  }

  return (
    <>
      <PageHeader
        title={`Edit user ${user.email}`}
        description={`ID: ${user.id}`}
        linkBack={"/admin/users"}
        copy={`${user.id}`}
        copySuccessMessage={"User ID copied!"}
        copyLabel="Copy user ID"
        actions={<DeleteUserButton userId={user.id} userEmail={user.email} />}
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
