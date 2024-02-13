"use client"

import { useRouter } from "next/navigation"

import { useCallback, useEffect, useState } from "react"

import { LayoutGrid, LogOut, NotebookPen, Settings, User } from "lucide-react"
import { useTheme } from "next-themes"
import { RxDesktop, RxMoon, RxSun } from "react-icons/rx"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

export function CommandMenu() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { setTheme } = useTheme()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "m" && (e.metaKey || e.ctrlKey)) {
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
      <p className="text-sm text-muted-foreground">
        Command menu{" "}
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>M
        </kbd>
      </p>
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
              <LayoutGrid className="mr-2 size-4" />
              <span>My Tools</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                runCommand(() => router.push("/tools/blog"))
              }}
            >
              <NotebookPen className="mr-2 size-4" />
              <span>Blog</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Quick">
            <CommandItem
              onSelect={() => {
                runCommand(() => router.push("/profile"))
              }}
            >
              <User className="mr-2 size-4" />
              <span>Profile</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                runCommand(() => router.push("/settings"))
              }}
            >
              <Settings className="mr-2 size-4" />
              <span>Settings</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                runCommand(() => router.push("/auth/logout"))
              }}
            >
              <LogOut className="mr-2 size-4" />
              <span>Log out</span>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Theme">
            <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
              <RxSun className="mr-2 size-4" />
              Light
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
              <RxMoon className="mr-2 size-4" />
              Dark
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
              <RxDesktop className="mr-2 size-4" />
              System
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
