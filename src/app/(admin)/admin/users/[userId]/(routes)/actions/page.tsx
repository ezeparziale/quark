import { protectPage } from "@/lib/rbac"

import { PageSection } from "@/components/page-header"

import { ResetPasswordCard } from "./_components/reset-password-card"
import { SetTemporaryPasswordCard } from "./_components/set-temporary-password-card"

type Params = Promise<{ userId: number }>

export default async function UserActionsPage(props: { params: Params }) {
  await protectPage({ permission: "admin:all" })

  const params = await props.params
  const userId = Number(params.userId)

  return (
    <>
      <PageSection title="Actions" description="Run action in the user." />
      <div className="grid gap-6 md:grid-cols-2">
        <ResetPasswordCard userId={userId} />
        <SetTemporaryPasswordCard userId={userId} />
      </div>
    </>
  )
}
