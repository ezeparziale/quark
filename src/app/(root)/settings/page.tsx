import { redirect } from "next/navigation"

import { getCurrentUser } from "@/actions/users/get-current-user"
import { getServerAuthSession } from "@/lib/auth"

import { Separator } from "@/components/ui/separator"

import DeleteAccount from "./_components/delete-account-form"
import EmailForm from "./_components/email-form"
import UsernameForm from "./_components/username-form"

export default async function Settings() {
  const session = await getServerAuthSession()

  if (!session) {
    redirect("/auth/login?callbackUrl=/settings")
  }
  const currentUser = await getCurrentUser()

  return (
    <>
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account settings.</p>
      </div>
      <Separator className="my-6" />
      <div className="space-y-6">
        <UsernameForm username={currentUser?.username || ""} />
        <EmailForm email={currentUser?.email || ""} />
        <Separator />
        <DeleteAccount />
      </div>
    </>
  )
}
