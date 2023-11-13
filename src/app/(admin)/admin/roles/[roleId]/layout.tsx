import { notFound } from "next/navigation"

import prismadb from "@/utils/prismadb"

import BackButtonLink from "@/components/back-button-link"
import { CopyButtonData } from "@/components/copy-clipboard-button"
import { Separator } from "@/components/ui/separator"

import DeleteUserModal from "./_components/delete-role-modal"
import { SidebarNav } from "./_components/sidebar-nav"

const getSideBarNavItems = (id: number) => {
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
    if (params.roleId === "new") {
      return null
    } else {
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
  }

  const role = await getRole()

  const title = role ? `Edit role: ${role.name}` : "Create role"
  const description = role ? `ID: ${role.id}` : "Add a new role"

  return (
    <>
      <BackButtonLink link={"/admin/roles"} />
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <div className="flex items-center justify-start">
            <p className="text-muted-foreground">{description}</p>
            {role?.id && <CopyButtonData textToCopy={params.roleId} />}
          </div>
        </div>
        {role && <DeleteUserModal role={role} />}
      </div>
      <Separator className="my-6" />
      {role ? (
        <>
          <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
            <aside className="lg:w-1/5">
              <SidebarNav items={sidebarNavItems} />
            </aside>
            <div className="flex-1">{children}</div>
          </div>
        </>
      ) : (
        <>{children}</>
      )}
    </>
  )
}
