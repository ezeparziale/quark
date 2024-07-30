import { KeySquare } from "lucide-react"

import EmptyState from "@/components/ui/data-tables/empty-state"

import CreateTokenButton from "./create-token-button"

export default function TokensEmptyStateTable() {
  return (
    <EmptyState
      icon={KeySquare}
      title="You have no tokens"
      description="You can start creating tokens"
      action={<CreateTokenButton />}
    />
  )
}
