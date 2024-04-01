import { protectPage } from "@/lib/rbac"

import { PageHeader } from "@/components/page-header"

import CreateRoleForm from "../_components/role-form"

export default async function NewRolePage() {
  await protectPage({ permission: "admin:all" })

  return (
    <>
      <PageHeader
        title="Create new role"
        description="Create a role which can be assigned to your users."
        linkBack="/admin/roles"
      />
      <CreateRoleForm />
    </>
  )
}
