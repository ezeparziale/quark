"use client"

import { useRouter } from "next/navigation"

import { useCallback, useEffect, useState } from "react"

import {
  LaptopMinimal,
  LayoutGrid,
  LogOut,
  LucideIcon,
  Moon,
  NotebookPen,
  Settings,
  Sun,
  User,
} from "lucide-react"
import { useTheme } from "next-themes"

import { useOperatingSystem } from "@/lib/hooks/use-operating-system"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

import { Button } from "./ui/button"

interface IQuickLinks {
  icon: LucideIcon
  label: string
  href: string
}

interface ITheme {
  icon: LucideIcon
  label: string
  action: string
}

const quickLinks: IQuickLinks[] = [
  { icon: User, label: "Profile", href: "/profile" },
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: LogOut, label: "Log out", href: "/auth/logout" },
]

const themeItems: ITheme[] = [
  { icon: Sun, label: "Light", action: "light" },
  { icon: Moon, label: "dark", action: "dark" },
  { icon: LaptopMinimal, label: "System", action: "system" },
]

export function CommandMenu() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { setTheme } = useTheme()
  const { isMacOS } = useOperatingSystem()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  return (
    <>
      <Button
        variant={"ghost"}
        onClick={() => setOpen(true)}
        className="items-center p-1"
      >
        <p className="text-muted-foreground space-x-1 text-sm">
          <span>Command menu</span>
          <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
            <span className="text-xs">{isMacOS ? "⌘" : "ctrl"}</span>
          </kbd>
          <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
            <span className="text-xs">K</span>
          </kbd>
        </p>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem
              onSelect={() => {
                runCommand(() => router.push("/tools"))
              }}
            >
              <LayoutGrid className="size-4" />
              <span>My Tools</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                runCommand(() => router.push("/tools/blog"))
              }}
            >
              <NotebookPen className="size-4" />
              <span>Blog</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Quick">
            {quickLinks.map((quickLink, index) => (
              <CommandItem
                key={index}
                onSelect={() => {
                  runCommand(() => router.push(quickLink.href))
                }}
              >
                <quickLink.icon className="size-4" />
                <span>{quickLink.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Theme">
            {themeItems.map((theme, index) => (
              <CommandItem
                key={index}
                onSelect={() => {
                  runCommand(() => setTheme(theme.action))
                }}
              >
                <theme.icon className="size-4" />
                <span>{theme.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
