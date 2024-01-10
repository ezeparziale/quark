import { protectPage } from "@/lib/rbac"

import PageNewAdminHeader from "@/components/admin/page-new-admin-header"

import RoleForm from "../_components/role-form"

const title = "Create new role"
const description = "Create a role which can be assigned to your users."
const linkBack = "/admin/roles"

export default async function NewRolePage() {
  await protectPage({ permission: "admin:all" })

  return (
    <PageNewAdminHeader title={title} description={description} linkBack={linkBack}>
      <RoleForm />
    </PageNewAdminHeader>
  )
}
