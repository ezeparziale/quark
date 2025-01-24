"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { useRef, useTransition } from "react"

import { Loader2, SearchIcon, XCircleIcon } from "lucide-react"
import { useDebouncedCallback } from "use-debounce"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface DataTableFilterProps {
  searchField: string
  query?: string
}

export function DataTableFiltersSSR({ query, searchField }: DataTableFilterProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { replace } = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isSearching, startTransition] = useTransition()

  const handleSearch = useDebouncedCallback((query: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams)
      if (query) {
        params.set("q", query)
        params.delete("page")
      } else {
        params.delete("q")
      }
      replace(`${pathname}?${params.toString()}`)
    })
  }, 300)

  const handleClearInput = () => {
    if (inputRef.current) {
      inputRef.current.value = ""
      handleSearch("")
    }
  }

  return (
    <div className="flex items-center justify-between">
      <div className="relative h-8 items-center">
        {isSearching ? (
          <Loader2 className="text-muted-foreground absolute top-2 left-2 size-4 animate-spin" />
        ) : (
          <SearchIcon className="text-muted-foreground absolute top-2 left-2 size-4" />
        )}

        <Input
          className="h-8 w-[180px] pl-8 lg:w-[250px]"
          placeholder={`Search ${searchField}...`}
          onChange={(e) => {
            handleSearch(e.target.value)
          }}
          defaultValue={query}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              inputRef?.current?.blur()
            }
          }}
          ref={inputRef}
        />
        {query && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="absolute top-2 right-2 h-4 w-4"
                onClick={handleClearInput}
                variant={"ghost"}
                size={"icon"}
              >
                <XCircleIcon className="text-muted-foreground size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clear search</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  )
}
