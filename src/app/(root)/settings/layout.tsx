import { PageHeader } from "@/components/page-header"

export default function Layput({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageHeader title="Settings" description="Manage your account settings." />
      {children}
    </>
  )
}
