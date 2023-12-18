import { protectPage } from "@/lib/rbac"

import UserForm from "../../_components/user-form"

export default async function NewUserPage({ params }: { params: { userId: string } }) {
  await protectPage(["admin:all"])

  return (
    <>
      <div className="space-y-6">
        <UserForm user={null} />
      </div>
    </>
  )
}
