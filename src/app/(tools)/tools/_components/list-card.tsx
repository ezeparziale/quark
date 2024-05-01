import Image from "next/image"
import Link from "next/link"

import { MoreHorizontalIcon, Star } from "lucide-react"

import { ITool } from "@/types/types"

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

export default function ListCard({ tool, handleFavorite }: Props) {
  return (
    <>
      <Card className="transition-colors hover:shadow-md hover:dark:border-muted-foreground">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div>
                <Image
                  src={`/icons/${tool.icon}-light.svg`}
                  width={24}
                  height={24}
                  alt={`icon_${tool.name}`}
                  className="block dark:hidden"
                />
                <Image
                  src={`/icons/${tool.icon}-dark.svg`}
                  width={24}
                  height={24}
                  alt={`icon_${tool.name}`}
                  className="hidden dark:block"
                />
              </div>
              <Button asChild variant={"link"} className="p-0">
                <Link href={tool.href}>
                  <span className="text-base font-normal leading-none">
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
                        <Star className="ml-2 size-4 fill-primary text-primary" />
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

function ListCardSkeleton() {
  return <Skeleton className="h-[88px] w-auto" />
}

ListCard.Skeleton = ListCardSkeleton
