import { Separator } from "@/components/ui/separator"

export default function Layput({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account settings.</p>
      </div>
      <Separator className="my-6" />
      {children}
    </>
  )
}
