"use client"

import { useOptimistic, useTransition } from "react"

import { toast } from "sonner"

import { ITool } from "@/types/types"

import { AddFavTool, RemoveFavTool } from "@/actions/users/update-tool-favorite"

import FavoritesSection from "./favorites-section"
import GridCard from "./grid-card"
import ListCard from "./list-card"

export default function ToolsCards({
  tools,
  favorites,
  view,
}: {
  tools: ITool[]
  favorites: ITool[]
  view: string
}) {
  const [_, startTransition] = useTransition()

  const [optimisticFavorites, addOptimisticFavorite] = useOptimistic(
    favorites || [],
    (state: ITool[], newTool: ITool) => {
      const oldValues = state.filter((tool) => tool.id != newTool.id)
      if (newTool.isFavorite) {
        const newState = [...oldValues, newTool].sort((a, b) => a.id - b.id)
        return newState
      } else {
        return [...oldValues]
      }
    },
  )

  const [optimisticTools, addOptimisticTool] = useOptimistic(
    tools || [],
    (state: ITool[], newTool: ITool) => {
      const newState = state.map((tool) => (tool.id === newTool.id ? newTool : tool))
      return newState
    },
  )

  async function handleFavorite(tool: ITool) {
    startTransition(async () => {
      addOptimisticFavorite({ ...tool, isFavorite: !tool.isFavorite })
      addOptimisticTool({ ...tool, isFavorite: !tool.isFavorite })

      if (tool.isFavorite) {
        const result = await RemoveFavTool({ toolId: tool.id })
        if (!result?.success) {
          toast.error(result?.message)
        }
      } else {
        const result = await AddFavTool({ toolId: tool.id })
        if (!result?.success) {
          toast.error(result?.message)
        }
      }
    })
  }

  return (
    <>
      {optimisticFavorites.length > 0 ? (
        <FavoritesSection
          favorites={optimisticFavorites}
          view={view}
          handleFavorite={handleFavorite}
        />
      ) : null}
      {view === "grid" && (
        <div className="my-6 grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {optimisticTools &&
            optimisticTools.map((tool) => (
              <GridCard
                key={`grid_${tool.id}`}
                tool={tool}
                handleFavorite={handleFavorite}
              />
            ))}
        </div>
      )}
      {view === "list" && (
        <div className="my-6 grid gap-5">
          {optimisticTools &&
            optimisticTools.map((tool) => (
              <ListCard
                key={`list_${tool.id}`}
                tool={tool}
                handleFavorite={handleFavorite}
              />
            ))}
        </div>
      )}
    </>
  )
}
