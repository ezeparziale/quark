import { protectPage } from "@/lib/rbac"

import PageNewAdminHeader from "@/components/admin/page-new-admin-header"

import PermissionForm from "../_components/permission-form"

const title = "Create new permission"
const description = "Create a permission which can be assigned to your roles."
const linkBack = "/admin/permissions"

export default async function NewPermissionPage() {
  await protectPage({ permission: "admin:all" })

  return (
    <PageNewAdminHeader title={title} description={description} linkBack={linkBack}>
      <PermissionForm />
    </PageNewAdminHeader>
  )
}
