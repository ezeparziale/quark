import { notFound } from "next/navigation"

import { NavItem } from "@/types/types"

import prismadb from "@/lib/prismadb"

import { SidebarNav } from "@/components/admin/sidebar-nav"
import { PageHeader } from "@/components/page-header"

import DeleteRoleButton from "./_components/delete-role-button"

const getSideBarNavItems = (id: number): NavItem[] => {
  const baseHref = `/admin/roles/${id}`

  return [
    {
      title: "Settings",
      href: baseHref,
      type: "parent",
    },
    {
      title: "Permissions",
      href: `${baseHref}/permissions`,
      type: "child",
    },
    {
      title: "Users",
      href: `${baseHref}/users`,
      type: "child",
    },
    {
      title: "Tools",
      href: `${baseHref}/tools`,
      type: "child",
    },
  ]
}

type Params = Promise<{ roleId: number }>

export default async function SettingsLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Params
}) {
  const id = Number((await params).roleId)

  const sidebarNavItems = getSideBarNavItems(id)

  if (!id) {
    return notFound()
  }

  const role = await prismadb.role.findUnique({
    where: { id },
  })

  if (!role) {
    return notFound()
  }

  return (
    <>
      <PageHeader
        title={`Edit role ${role.name}`}
        description={`ID: ${role.id}`}
        linkBack="/admin/roles"
        copy={String(`${role.id}`)}
        copySuccessMessage={"Role ID copied!"}
        copyLabel="Copy role ID"
        actions={<DeleteRoleButton roleId={role.id} roleKey={role.key} />}
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
