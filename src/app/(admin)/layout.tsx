import MaxWidthWrapper from "@/components/max-width-wrapper"
import NavTabs from "@/components/navbar/nav-tabs"
import Navbar from "@/components/navbar/navbar"
import { SiteFooter } from "@/components/site-footer"

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
      <NavTabs items={navigation} />
      <main>
        <MaxWidthWrapper className="min-h-screen">{children}</MaxWidthWrapper>
      </main>
      <SiteFooter />
    </>
  )
}
