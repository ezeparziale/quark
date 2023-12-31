import { protectPage } from "@/lib/rbac"

import BackButtonLink from "@/components/back-button-link"
import { Separator } from "@/components/ui/separator"

import RoleForm from "../_components/role-form"

const title = "Create new role"
const description = "Create a role which can be assigned to your users."

export default async function NewRolePage() {
  await protectPage(["admin:all"])

  return (
    <>
      <BackButtonLink link={"/admin/roles"} />
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <div className="flex items-center justify-start">
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>
      <Separator className="my-6" />
      <RoleForm />
    </>
  )
}
