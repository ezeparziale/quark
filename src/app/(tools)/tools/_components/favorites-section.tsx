"use client"

import { useState } from "react"

import { ChevronDown, ChevronRight, ChevronUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import GridCard from "./grid-card"
import ListCard from "./list-card"

type IFavProps = {
  id: number
  name: string
  href: string
  icon: string
  isFavorite: boolean
}[]

export default function FavoritesSection({
  favorites,
  view,
}: {
  favorites: IFavProps
  view: string
}) {
  const [showFavorites, setShowFavorites] = useState(true)

  const toggleFavorites = () => {
    setShowFavorites(!showFavorites)
  }

  return (
    <>
      <Button variant={"ghost"} onClick={toggleFavorites}>
        {showFavorites ? (
          <ChevronDown className="mr-2 size-4" />
        ) : (
          <ChevronRight className="mr-2 size-4" />
        )}
        Your favorites
      </Button>
      {showFavorites && (
        <>
          {view === "grid" && (
            <div className="mb-6 mt-2 grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
              {favorites.map((tool) => (
                <GridCard key={`fav_grid_${tool.id}`} tool={tool} />
              ))}
            </div>
          )}
          {view === "list" && (
            <div className="mb-6 mt-2 grid gap-5">
              {favorites.map((tool) => (
                <ListCard key={`fav_list_${tool.id}`} tool={tool} />
              ))}
            </div>
          )}
          <Separator />
        </>
      )}
    </>
  )
}
