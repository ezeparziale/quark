import HeaderHav from "@/components/admin/header-nav"
import MaxWidthWrapper from "@/components/max-width-wrapper"
import Navbar from "@/components/navbar/navbar"

export interface INavigation {
  title: string
  href: string
  type: "parent" | "child"
}

const navigation: INavigation[] = [
  { title: "Overview", href: "/admin", type: "parent" },
  { title: "Users", href: "/admin/users", type: "child" },
  { title: "Roles", href: "/admin/roles", type: "child" },
  { title: "Permissions", href: "/admin/permissions", type: "child" },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <HeaderHav items={navigation} />
      <main>
        <MaxWidthWrapper>{children}</MaxWidthWrapper>
      </main>
    </>
  )
}
