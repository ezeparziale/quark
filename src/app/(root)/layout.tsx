import MaxWidthWrapper from "@/components/max-width-wrapper"
import Navbar from "@/components/navbar/navbar"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>
        <MaxWidthWrapper>{children}</MaxWidthWrapper>
      </main>
    </>
  )
}
