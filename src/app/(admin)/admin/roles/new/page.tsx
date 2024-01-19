import { protectPage } from "@/lib/rbac"

import { PageHeader } from "@/components/page-header"

import CreateRoleForm from "../_components/create-role-form"

const title = "Create new role"
const description = "Create a role which can be assigned to your users."
const linkBack = "/admin/roles"

export default async function NewRolePage() {
  await protectPage({ permission: "admin:all" })

  return (
    <>
      <PageHeader title={title} description={description} linkBack={linkBack} />
      <CreateRoleForm />
    </>
  )
}
