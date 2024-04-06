"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { useEffect, useState } from "react"

import { LayoutGridIcon, RowsIcon } from "lucide-react"
import { useDebouncedCallback } from "use-debounce"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const toggleGroupItemClasses =
  "data-[state=on]:bg-muted-foreground/20 data-[state=on]:text-black data-[state=on]:dark:text-white"

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

  const handleSearch = useDebouncedCallback((view: string) => {
    const params = new URLSearchParams(searchParams)
    if (view) {
      params.set("view", view)
    } else {
      params.delete("view")
    }
    replace(`${pathname}?${params.toString()}`)
  }, 300)

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
      <ToggleGroupItem
        value="grid"
        aria-label="Grid view"
        className={toggleGroupItemClasses}
      >
        <LayoutGridIcon className="size-5" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="list"
        aria-label="List view"
        className={toggleGroupItemClasses}
      >
        <RowsIcon className="size-5" />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
