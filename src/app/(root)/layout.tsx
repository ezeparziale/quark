import MaxWidthWrapper from "@/components/max-width-wrapper"
import Navbar from "@/components/navbar/navbar"
import { SiteFooter } from "@/components/site-footer"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>
        <MaxWidthWrapper className="min-h-screen">{children}</MaxWidthWrapper>
      </main>
      <SiteFooter />
    </>
  )
}
