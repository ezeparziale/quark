import MaxWidthWrapper from "@/components/max-width-wrapper"
import Navbar from "@/components/navbar/navbar"

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>
        <MaxWidthWrapper>{children}</MaxWidthWrapper>
      </main>
    </>
  )
}
