"use client"

import { usePathname, useRouter } from "next/navigation"

import type React from "react"
import { useMemo, useState } from "react"

import { Check, ChevronsUpDown, LayoutGrid, PlusCircle } from "lucide-react"

import type { ITool } from "@/types/types"

import { useMediaQuery } from "@/lib/hooks/use-media-query"
import useTools from "@/lib/swr/use-tools"
import { cn, getIconComponent } from "@/lib/utils"

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
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface ToolSwitcherProps extends PopoverTriggerProps {}

export default function ToolSwitcher({ className }: ToolSwitcherProps) {
  const [open, setOpen] = useState(false)

  const pathname = usePathname()
  const { isMobile } = useMediaQuery()

  const { tools, isLoading } = useTools()

  const selected = useMemo(() => {
    const selectTool = tools?.find((tool) => pathname.startsWith(tool.href))

    if (selectTool) return { ...selectTool }

    return {
      id: -1,
      name: "Select a tool",
      href: "/tools",
      icon: "LayoutGrid",
    }
  }, [pathname, tools])

  const SelectedIcon = useMemo(() => getIconComponent(selected.icon), [selected.icon])

  if (!tools || isLoading) return <Skeleton className="h-8 w-40 md:w-48" />

  if (!isMobile) {
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
            <SelectedIcon className="size-4" />
            {selected.name}
            <ChevronsUpDown className="ml-auto size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40 p-0 md:w-48" align="start" forceMount>
          <ToolsList setOpen={setOpen} tools={tools} selected={selected} />
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a tool"
          className={cn("w-40 justify-between md:w-48", className)}
        >
          <SelectedIcon className="size-4" />
          <span>{selected.name}</span>
          <ChevronsUpDown className="ml-auto size-4 shrink-0 opacity-50" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <ToolsList setOpen={setOpen} tools={tools} selected={selected} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function ToolsList({
  tools,
  selected,
  setOpen,
}: {
  tools: ITool[]
  selected: ITool
  setOpen: (open: boolean) => void
}) {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <Command>
      <CommandList>
        <CommandInput placeholder="Search tool..." showEscKey />
        <CommandEmpty>No tool found.</CommandEmpty>
        <CommandGroup key="Tools" heading="Tools">
          {tools.map((tool) => {
            const ToolIcon = getIconComponent(tool.icon)

            return (
              <CommandItem
                key={tool.id}
                onSelect={() => {
                  setOpen(false)
                  router.push(tool.href)
                }}
                className="text-sm"
              >
                <ToolIcon className="size-4" />
                <span>{tool.name}</span>
                <Check
                  className={cn(
                    "ml-auto size-4",
                    selected.name === tool.name ? "opacity-100" : "opacity-0",
                  )}
                />
              </CommandItem>
            )
          })}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup>
          <CommandItem
            onSelect={() => {
              setOpen(false)
              router.push("/tools")
            }}
          >
            <LayoutGrid className="size-4" />
            <span>My tools</span>
            <Check
              className={cn(
                "ml-auto size-4",
                pathname === "/tools" ? "opacity-100" : "opacity-0",
              )}
            />
          </CommandItem>
          <CommandItem
            onSelect={() => {
              setOpen(false)
            }}
          >
            <PlusCircle className="size-4" />
            <span>Add new tools</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
