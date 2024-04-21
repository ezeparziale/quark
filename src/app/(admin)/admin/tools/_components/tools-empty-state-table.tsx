import { LayoutGrid } from "lucide-react"

import EmptyState from "@/components/ui/data-tables/empty-state"

import CreateToolButton from "./create-tool-button"

export default function PermissionsEmptyStateTable() {
  return (
    <EmptyState
      icon={LayoutGrid}
      title="You have no tools"
      description="You can start creating tools"
      action={<CreateToolButton />}
    />
  )
}
