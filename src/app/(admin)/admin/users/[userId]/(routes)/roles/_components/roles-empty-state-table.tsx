import { FilePlus } from "lucide-react"

import EmptyState from "@/components/ui/data-tables/empty-state"

import AddRoleButton from "./add-role-button"

export default function AddRolesEmptyStateTable({ id }: { id: string }) {
  return (
    <EmptyState
      icon={FilePlus}
      title="You have no roles for this user"
      description="You can start adding roles"
      action={<AddRoleButton id={id} />}
    />
  )
}
