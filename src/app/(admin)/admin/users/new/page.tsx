import { protectPage } from "@/lib/rbac"

import { PageHeader } from "@/components/page-header"

import CreateUserForm from "../_components/create-user-form"

const title = "Create user"
const description = "Add a new user"
const linkBack = "/admin/users"

export default async function NewPermissionPage() {
  await protectPage({ permission: "admin:all" })

  return (
    <>
      <PageHeader title={title} description={description} linkBack={linkBack} />
      <CreateUserForm />
    </>
  )
}
