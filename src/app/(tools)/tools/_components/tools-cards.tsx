import { getCurrentUser } from "@/actions/users/get-current-user"
import { getUserTools } from "@/data/user"

import FavoritesSection from "./favorites-section"
import GridCard from "./grid-card"
import ListCard from "./list-card"

export default async function ToolsCards({
  view,
  search,
}: {
  view: string
  search: string
}) {
  const currentUser = await getCurrentUser()

  const data = await getUserTools(currentUser?.id!, search)

  const favoriteTools = data?.filter((tool) => tool.isFavorite === true)

  return (
    <>
      {favoriteTools?.length ? (
        <FavoritesSection favorites={favoriteTools} view={view} />
      ) : null}
      {view === "grid" && (
        <div className="my-6 grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {data && data.map((tool) => <GridCard key={`grid_${tool.id}`} tool={tool} />)}
        </div>
      )}
      {view === "list" && (
        <div className="my-6 grid gap-5">
          {data && data.map((tool) => <ListCard key={`list_${tool.id}`} tool={tool} />)}
        </div>
      )}
    </>
  )
}
