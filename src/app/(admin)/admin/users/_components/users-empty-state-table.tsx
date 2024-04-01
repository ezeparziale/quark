import { FilePlus } from "lucide-react"

import EmptyState from "@/components/ui/data-tables/empty-state"

import CreateUserButton from "./create-user-button"

export default function UsersEmptyStateTable() {
  return (
    <EmptyState
      icon={FilePlus}
      title="You have no users"
      description="You can start creating users"
      action={<CreateUserButton />}
    />
  )
}
