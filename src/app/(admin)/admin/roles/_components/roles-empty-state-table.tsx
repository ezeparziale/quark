import { FilePlus } from "lucide-react"

import EmptyState from "@/components/ui/data-tables/empty-state"

import CreateRoleButton from "./create-role-button"

export default function RolesEmptyStateTable() {
  return (
    <EmptyState
      icon={FilePlus}
      title="You have no roles"
      description="You can start creating roles"
      action={<CreateRoleButton />}
    />
  )
}
