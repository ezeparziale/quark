import { notFound } from "next/navigation"

import prismadb from "@/lib/prismadb"
import { NavItem } from "@/types/types"

import { SidebarNav } from "@/components/admin/sidebar-nav"
import { PageHeader } from "@/components/page-header"

import DeleteRoleModal from "./_components/delete-role-modal"

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
  ]
}

interface SettingsLayoutProps {
  children: React.ReactNode
  params: { roleId: string }
}

export default async function SettingsLayout({
  children,
  params,
}: SettingsLayoutProps) {
  const sidebarNavItems = getSideBarNavItems(Number(params.roleId))

  const getRole = async () => {
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

    return role
  }

  const role = await getRole()

  const title = `Edit role ${role.name}`
  const description = `ID: ${role.id}`
  const copy = String(`${role.id}`)
  const linkBack = "/admin/roles"

  return (
    <>
      <PageHeader
        title={title}
        description={description}
        linkBack={linkBack}
        copy={copy}
        actions={<DeleteRoleModal role={role} />}
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
