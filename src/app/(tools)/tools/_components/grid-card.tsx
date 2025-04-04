import Link from "next/link"

import { useMemo } from "react"

import { MoreHorizontalIcon, Star } from "lucide-react"

import { ITool } from "@/types/types"

import { getIconComponent } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"

type Props = {
  tool: ITool
  handleFavorite: (tool: ITool) => void
}

export default function GridCard({ tool, handleFavorite }: Props) {
  const SelectedIcon = useMemo(() => getIconComponent(tool.icon), [tool.icon])

  return (
    <>
      <Card className="dark:hover:border-muted-foreground transition-colors hover:shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <SelectedIcon className="size-6" />
              <Button asChild variant={"link"} className="p-0">
                <Link href={tool.href} prefetch={true}>
                  <span className="text-base leading-none font-normal">
                    {tool.name}
                  </span>
                </Link>
              </Button>
            </div>
            <div className="flex items-center space-x-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size={"icon"} variant={"ghost"}>
                    <MoreHorizontalIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40" align="end" forceMount>
                  <DropdownMenuItem
                    asChild
                    onSelect={() => handleFavorite({ ...tool })}
                  >
                    {tool.isFavorite ? (
                      <div className="flex flex-1 items-center justify-between">
                        <span>Remove Favorite</span>
                        <Star className="fill-primary text-primary ml-2 size-4" />
                      </div>
                    ) : (
                      <div className="flex flex-1 items-center justify-between">
                        <span>Add Favorite</span>
                        <Star className="ml-2 size-4" />
                      </div>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={tool.href}>Open</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>
    </>
  )
}

function GirdCardSkeleton() {
  return <Skeleton className="h-[88px] w-auto" />
}

GridCard.Skeleton = GirdCardSkeleton
