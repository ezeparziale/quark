"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { useRef, useTransition } from "react"

import { Loader2, SearchIcon, XCircleIcon } from "lucide-react"
import { useDebouncedCallback } from "use-debounce"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export default function ToolSearch() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  const [isSearching, startTransition] = useTransition()
  const inputRef = useRef<HTMLInputElement>(null)

  const q = searchParams.get("q")?.toString()

  const handleSearch = useDebouncedCallback((query: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams)
      if (query) {
        params.set("q", query)
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
    <div className="relative flex w-full min-w-40 items-center gap-1.5">
      {isSearching ? (
        <Loader2 className="text-muted-foreground absolute left-4 size-5 animate-spin" />
      ) : (
        <SearchIcon className="text-muted-foreground absolute left-4 size-5" />
      )}

      <Input
        className="w-full p-5 pl-12"
        placeholder="Search..."
        onChange={(e) => {
          handleSearch(e.target.value)
        }}
        defaultValue={q}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            inputRef?.current?.blur()
          }
        }}
        ref={inputRef}
      />
      {q && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="absolute right-1"
              onClick={handleClearInput}
              variant={"ghost"}
              size={"icon"}
            >
              <XCircleIcon className="text-muted-foreground size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Clear search</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  )
}
