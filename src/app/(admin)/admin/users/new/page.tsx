import { protectPage } from "@/lib/rbac"

import { PageHeader } from "@/components/page-header"

import CreateUserForm from "./_components/create-user-form"

export default async function NewUserPage() {
  await protectPage({ permission: "admin:all" })

  return (
    <>
      <PageHeader
        title="Create user"
        description="Add a new user."
        linkBack="/admin/users"
      />
      <CreateUserForm />
    </>
  )
}
