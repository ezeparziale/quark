"use client"

import { useEffect, useState } from "react"

import { useTheme } from "next-themes"
import { RxDesktop, RxMoon, RxSun } from "react-icons/rx"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ThemeSwitch({ isDropDown = true }: { isDropDown?: boolean }) {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  if (isDropDown) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9">
            <RxSun className="size-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <RxMoon className="absolute size-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <>
      <div className="flex flex-row items-center space-x-1 rounded-full border p-1">
        <button
          className={cn("p-1", theme === "light" && "rounded-full bg-muted")}
          onClick={() => setTheme("light")}
        >
          <RxSun className="size-4 transition-all" />
        </button>
        <button
          className={cn("p-1", theme === "system" && "rounded-full bg-muted")}
          onClick={() => setTheme("system")}
        >
          <RxDesktop className="size-4 transition-all" />
        </button>
        <button
          className={cn("p-1", theme === "dark" && "rounded-full bg-muted")}
          onClick={() => setTheme("dark")}
        >
          <RxMoon className="size-4 transition-all" />
        </button>
      </div>
    </>
  )
}
