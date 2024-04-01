import { FilePlus } from "lucide-react"

import EmptyState from "@/components/ui/data-tables/empty-state"

import AddUserButton from "./add-user-button"

export default function AddUsersEmptyStateTable({ id }: { id: number }) {
  return (
    <EmptyState
      icon={FilePlus}
      title="You have no users for this role"
      description="You can start adding users"
      action={<AddUserButton id={id} />}
    />
  )
}
