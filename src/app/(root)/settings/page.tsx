import { getCurrentUser } from "@/actions/users/get-current-user"

import { Separator } from "@/components/ui/separator"

import DeleteAccount from "./_components/delete-account-form"
import EmailForm from "./_components/email-form"
import UsernameForm from "./_components/username-form"

export default async function Settings() {
  const currentUser = await getCurrentUser("/auth/login?callbackUrl=/settings")

  return (
    <div className="space-y-6">
      <UsernameForm username={currentUser?.username || ""} />
      <EmailForm email={currentUser?.email || ""} />
      <Separator />
      <DeleteAccount />
    </div>
  )
}
