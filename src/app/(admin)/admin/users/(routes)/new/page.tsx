import { withRoles } from "@/lib/rbac"

import UserForm from "../../_components/user-form"

const NewUserPage = async ({ params }: { params: { userId: string } }) => {
  return (
    <>
      <div className="space-y-6">
        <UserForm user={null} />
      </div>
    </>
  )
}

export default withRoles(NewUserPage, ["admin:all"])
