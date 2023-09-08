import Navbar from "@/components/navbar/navbar"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="bg-white dark:bg-zinc-950">{children}</main>
    </>
  )
}
