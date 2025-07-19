import { notFound } from "next/navigation"

import { NavItem } from "@/types/types"

import { getUserById } from "@/data/user"

import { SidebarNav } from "@/components/admin/sidebar-nav"
import { DateDescription } from "@/components/date-description"
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
      title: "Profile",
      href: `${baseHref}/profile`,
      type: "child",
    },
    {
      title: "Roles",
      href: `${baseHref}/roles`,
      type: "child",
    },
    {
      title: "Actions",
      href: `${baseHref}/actions`,
      type: "child",
    },
    {
      title: "Metadata",
      href: `${baseHref}/metadata`,
      type: "child",
    },
    {
      title: "Logs",
      href: `${baseHref}/logs`,
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
        title={`${user.email}`}
        description={`ID: ${user.id}`}
        copy={`${user.id}`}
        copySuccessMessage={"User ID copied!"}
        copyLabel="Copy user ID"
        descriptionExtras={[
          <div key="last-sign-in" className="flex items-center gap-x-2">
            <p className="text-sm text-gray-500">| Last sign in:</p>
            <DateDescription date={user.lastSignInAt} fallbackText="Never" />
          </div>,
        ]}
        linkBack={"/admin/users"}
        actions={<DeleteUserButton userId={user.id} userEmail={user.email} />}
      />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
        <aside className="lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1">{children}</div>
      </div>
    </>
  )
}
