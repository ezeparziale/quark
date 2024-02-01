"use client"

import { usePathname, useRouter } from "next/navigation"

import * as React from "react"
import { useMemo } from "react"

import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown, PlusCircle, ShieldCheck } from "lucide-react"

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

interface IToolsProps {
  label: string
  value?: string
  href: string
  icon?: React.JSX.Element
}

const tools: IToolsProps[] = [
  {
    label: "Admin",
    value: "admin",
    href: "/admin",
    icon: <ShieldCheck className="mr-2 h-4 w-4" />,
  },
]

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface ToolSwitcherProps extends PopoverTriggerProps {}

export default function ToolSwitcher({ className }: ToolSwitcherProps) {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const selected = useMemo(() => {
    const selectTool = tools.find((tool) => pathname.startsWith(tool.href))

    if (selectTool) return { ...selectTool }

    return {
      label: "Select a tool",
      href: "/",
    }
  }, [pathname])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a tool"
          className={cn("w-[200px] justify-between", className)}
        >
          {selected.icon}
          {selected.label}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search tool..." />
            <CommandEmpty>No tool found.</CommandEmpty>
            <CommandGroup key="Tools" heading="Tools">
              {tools.map((tool) => (
                <CommandItem
                  key={tool.value}
                  onSelect={() => {
                    setOpen(false)
                    router.push(tool.href)
                  }}
                  className="text-sm"
                >
                  {tool.icon}
                  {tool.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selected.value === tool.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false)
                }}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add new tools
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
