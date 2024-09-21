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

interface SettingsLayoutProps {
  children: React.ReactNode
  params: { roleId: number }
}

export default async function SettingsLayout({
  children,
  params,
}: SettingsLayoutProps) {
  const sidebarNavItems = getSideBarNavItems(Number(params.roleId))

  const id = Number(params.roleId)

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
        actions={<DeleteRoleButton roleId={role.id} roleKey={role.key} />}
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
