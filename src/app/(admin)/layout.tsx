import Container from "@/components/container"
import Navbar from "@/components/navbar/navbar"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>
        <Container>{children}</Container>
      </main>
    </>
  )
}
