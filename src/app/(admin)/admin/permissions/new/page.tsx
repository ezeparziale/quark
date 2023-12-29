import { protectPage } from "@/lib/rbac"

import BackButtonLink from "@/components/back-button-link"
import { Separator } from "@/components/ui/separator"

import PermissionForm from "../_components/permission-form"

const title = "Create new permission"
const description = "Create a permission which can be assigned to your roles."

export default async function NewPermissionPage() {
  await protectPage(["admin:all"])

  return (
    <>
      <BackButtonLink link={"/admin/permissions"} />
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <div className="flex items-center justify-start">
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>
      <Separator className="my-6" />
      <PermissionForm />
    </>
  )
}
