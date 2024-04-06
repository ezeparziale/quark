import Image from "next/image"
import Link from "next/link"

import { MoreHorizontalIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"

import { AddFavorite } from "./add-favorite-form"
import { RemoveFavorite } from "./remove-favorite-form"

type Props = {
  tool: {
    id: number
    name: string
    href: string
    icon: string
    isFavorite: boolean
  }
}

export default function GridCard({ tool }: Props) {
  return (
    <>
      <Card className="transition-colors hover:shadow-lg">
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
                  <DropdownMenuItem asChild>
                    {tool.isFavorite ? (
                      <RemoveFavorite id={tool.id} />
                    ) : (
                      <AddFavorite id={tool.id} />
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
