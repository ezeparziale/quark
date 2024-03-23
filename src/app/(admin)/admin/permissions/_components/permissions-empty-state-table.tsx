import { FilePlus } from "lucide-react"

import EmptyState from "@/components/ui/data-tables/empty-state"

import CreatePermissionButton from "./create-permission-button"

export default function PermissionsEmptyStateTable() {
  return (
    <EmptyState
      Icon={FilePlus}
      title="You have no permissions"
      description="You can start creating permissions"
      button={<CreatePermissionButton className="mt-4" />}
    />
  )
}
