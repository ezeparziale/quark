import { protectPage } from "@/lib/rbac"

import PageNewAdminHeader from "@/components/admin/page-new-admin-header"

import UserForm from "../_components/user-form"

const title = "Create user"
const description = "Add a new user"
const linkBack = "/admin/users"

export default async function NewPermissionPage() {
  await protectPage(["admin:all"])

  return (
    <PageNewAdminHeader title={title} description={description} linkBack={linkBack}>
      <UserForm />
    </PageNewAdminHeader>
  )
}
