import { protectPage } from "@/lib/rbac"

import { PageHeader } from "@/components/page-header"

import PermissionForm from "../_components/permission-form"

export default async function NewPermissionPage() {
  await protectPage({ permission: "admin:all" })

  return (
    <>
      <PageHeader
        title="Create new permission"
        description="Create a permission which can be assigned to your roles."
        linkBack="/admin/permissions"
      />
      <PermissionForm />
    </>
  )
}
