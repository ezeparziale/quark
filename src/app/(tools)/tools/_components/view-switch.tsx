"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { useEffect, useState } from "react"

import { LayoutGridIcon, RowsIcon } from "lucide-react"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

const toggleGroupItemClasses =
  "data-[state=on]:bg-muted-foreground/20 data-[state=on]:text-black dark:data-[state=on]:text-white"

export default function ViewSwitch() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const [value, setValue] = useState("grid")

  useEffect(() => {
    const view = searchParams.get("view")

    if (view) {
      setValue(view)
    }
  }, [value, searchParams])

  const handleSearch = (view: string) => {
    const params = new URLSearchParams(searchParams)
    if (view) {
      params.set("view", view)
    } else {
      params.delete("view")
    }
    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <ToggleGroup
      type="single"
      variant="outline"
      value={value}
      onValueChange={(value) => {
        if (value) {
          setValue(value)
          handleSearch(value)
        }
      }}
      className="hidden lg:flex"
    >
      <Tooltip>
        <ToggleGroupItem
          value="grid"
          aria-label="Grid view"
          className={toggleGroupItemClasses}
          asChild
        >
          <TooltipTrigger>
            <LayoutGridIcon className="size-5" />
          </TooltipTrigger>
        </ToggleGroupItem>
        <TooltipContent>
          <p>Grid view</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <ToggleGroupItem
          value="list"
          aria-label="List view"
          className={toggleGroupItemClasses}
          asChild
        >
          <TooltipTrigger>
            <RowsIcon className="size-5" />
          </TooltipTrigger>
        </ToggleGroupItem>
        <TooltipContent>
          <p>List view</p>
        </TooltipContent>
      </Tooltip>
    </ToggleGroup>
  )
}
