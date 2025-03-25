"use client"

import { useEffect, useState } from "react"

import { LaptopMinimal, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

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
          <Button
            variant="ghost"
            size="icon"
            className="h-9"
            aria-label="Choose a theme"
          >
            <Sun className="size-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute size-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => setTheme("light")}
            aria-label="Set light theme"
          >
            Light
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setTheme("dark")}
            aria-label="Set dark theme"
          >
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setTheme("system")}
            aria-label="Set system theme"
          >
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <>
      <div className="flex flex-row items-center space-x-1 rounded-full border p-1">
        {[
          { name: "light", icon: Sun, label: "Light theme" },
          { name: "system", icon: LaptopMinimal, label: "System theme" },
          { name: "dark", icon: Moon, label: "Dark theme" },
        ].map(({ name, icon: Icon, label }) => (
          <button
            key={name}
            className={cn("rounded-full p-1", theme === name && "bg-muted")}
            onClick={() => setTheme(name)}
            role="radio"
            aria-checked={theme === name}
            aria-label={label}
          >
            <Icon className="size-4 transition-all" aria-hidden="true" />
          </button>
        ))}
      </div>
    </>
  )
}
