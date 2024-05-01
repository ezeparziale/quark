import { getCurrentUser } from "@/actions/users/get-current-user"

import { getUserTools } from "@/data/user"

import ToolEmptyState from "./tool-empty-state"
import ToolsCards from "./tools-cards"

export default async function ToolsSection({
  view,
  search,
}: {
  view: string
  search: string
}) {
  const currentUser = await getCurrentUser()

  const data = (await getUserTools(currentUser?.id!, search)) || []

  const favoriteTools = data?.filter((tool) => tool.isFavorite === true) || []

  if (!data.length) {
    return <ToolEmptyState />
  }

  return <ToolsCards tools={data} favorites={favoriteTools} view={view} />
}
