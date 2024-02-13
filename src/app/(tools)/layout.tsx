import Navbar from "@/components/navbar/navbar"
import { SiteFooter } from "@/components/site-footer"

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="min-h-screen">{children}</div>
      <SiteFooter />
    </>
  )
}
