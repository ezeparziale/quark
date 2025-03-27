import { useState } from "react"

import { ChevronDown, ChevronRight } from "lucide-react"

import { ITool } from "@/types/types"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import GridCard from "./grid-card"
import ListCard from "./list-card"

export default function FavoritesSection({
  favorites,
  view,
  handleFavorite,
}: {
  favorites: ITool[]
  view: string
  handleFavorite: (tool: ITool) => void
}) {
  const [showFavorites, setShowFavorites] = useState(true)

  const toggleFavorites = () => {
    setShowFavorites(!showFavorites)
  }

  return (
    <>
      <Button variant={"ghost"} onClick={toggleFavorites}>
        {showFavorites ? (
          <ChevronDown className="size-4" />
        ) : (
          <ChevronRight className="size-4" />
        )}
        Your favorites
      </Button>
      {showFavorites && (
        <>
          {view === "grid" && (
            <div className="mt-2 mb-6 grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
              {favorites.map((tool) => (
                <GridCard
                  key={`fav_grid_${tool.id}`}
                  tool={tool}
                  handleFavorite={handleFavorite}
                />
              ))}
            </div>
          )}
          {view === "list" && (
            <div className="mt-2 mb-6 grid gap-5">
              {favorites.map((tool) => (
                <ListCard
                  key={`fav_list_${tool.id}`}
                  tool={tool}
                  handleFavorite={handleFavorite}
                />
              ))}
            </div>
          )}
          <Separator />
        </>
      )}
    </>
  )
}
