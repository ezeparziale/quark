import { getCurrentUser } from "@/actions/users/get-current-user"

import DeleteAccount from "./_components/delete-account-form"
import EmailForm from "./_components/email-form"
import UsernameForm from "./_components/username-form"

export default async function SettingsPage() {
  const currentUser = await getCurrentUser("/auth/login?callbackUrl=/settings")

  return (
    <div className="space-y-6">
      <UsernameForm username={currentUser?.username!} />
      <EmailForm email={currentUser?.email!} />
      <DeleteAccount />
    </div>
  )
}
