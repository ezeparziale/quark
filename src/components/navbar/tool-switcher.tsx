"use client"

import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"

import { useMemo, useState } from "react"

import useTools from "@/lib/swr/use-tools"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown, LayoutGrid, PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

import { Skeleton } from "../ui/skeleton"

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface ToolSwitcherProps extends PopoverTriggerProps {}

export default function ToolSwitcher({ className }: ToolSwitcherProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const { tools, isLoading } = useTools()

  const selected = useMemo(() => {
    const selectTool = tools?.find((tool) => pathname.startsWith(tool.href))

    if (selectTool) return { ...selectTool }

    return {
      id: null,
      name: "Select a tool",
      href: "/tools",
      icon: "layout-grid",
    }
  }, [pathname, tools])

  if (!tools || isLoading) return <Skeleton className="h-8 w-40 md:w-48" />

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a tool"
          className={cn("w-40 justify-between md:w-48", className)}
        >
          <Image
            src={`/icons/${selected.icon}-light.svg`}
            width={16}
            height={16}
            alt={`icon_${selected.name}`}
            className="mr-2 block dark:hidden"
          />
          <Image
            src={`/icons/${selected.icon}-dark.svg`}
            width={16}
            height={16}
            alt={`icon_${selected.name}`}
            className="mr-2 hidden dark:block"
          />
          {selected.name}
          <ChevronsUpDown className="ml-auto size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-0 md:w-48">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search tool..." showEscKey />
            <CommandEmpty>No tool found.</CommandEmpty>
            <CommandGroup key="Tools" heading="Tools">
              {tools.map((tool) => (
                <CommandItem
                  key={tool.id}
                  onSelect={() => {
                    setOpen(false)
                    router.push(tool.href)
                  }}
                  className="text-sm"
                >
                  <Image
                    src={`/icons/${tool.icon}-light.svg`}
                    width={16}
                    height={16}
                    alt={`icon_${tool.name}`}
                    className="mr-2 block dark:hidden"
                  />
                  <Image
                    src={`/icons/${tool.icon}-dark.svg`}
                    width={16}
                    height={16}
                    alt={`icon_${tool.name}`}
                    className="mr-2 hidden dark:block"
                  />
                  {tool.name}
                  <Check
                    className={cn(
                      "ml-auto size-4",
                      selected.name === tool.name ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false)
                  router.push("/tools")
                }}
              >
                <LayoutGrid className="mr-2 size-4" />
                My tools
                <Check
                  className={cn(
                    "ml-auto size-4",
                    pathname.endsWith("/tools") ? "opacity-100" : "opacity-0",
                  )}
                />
              </CommandItem>
              <CommandItem
                onSelect={() => {
                  setOpen(false)
                }}
              >
                <PlusCircle className="mr-2 size-4" />
                Add new tools
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
