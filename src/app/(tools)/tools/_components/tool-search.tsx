"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { SearchIcon } from "lucide-react"
import { useDebouncedCallback } from "use-debounce"

import { Input } from "@/components/ui/input"

export default function ToolSearch() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const handleSearch = useDebouncedCallback((query: string) => {
    const params = new URLSearchParams(searchParams)
    if (query) {
      params.set("q", query)
    } else {
      params.delete("q")
    }
    replace(`${pathname}?${params.toString()}`)
  }, 300)

  return (
    <div className="relative flex w-full min-w-40 items-center gap-1.5">
      <SearchIcon className="absolute left-4 size-5 text-muted-foreground" />
      <Input
        className="w-full p-5 pl-12"
        placeholder="Search..."
        onChange={(e) => {
          handleSearch(e.target.value)
        }}
        defaultValue={searchParams.get("q")?.toString()}
      />
    </div>
  )
}
