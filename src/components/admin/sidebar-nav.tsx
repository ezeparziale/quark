"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { NavItem } from "@/types/types"

import { cn } from "@/lib/utils"

import { buttonVariants } from "@/components/ui/button"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: NavItem[]
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav
      className={cn(
        "flex flex-row lg:flex-col",
        "space-x-2 lg:space-y-1 lg:space-x-0",
        "overflow-x-auto lg:overflow-x-hidden",
        "lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto",
        "px-2 py-2 md:px-4",
        className,
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            (item.type === "parent" && pathname === item.href) ||
              (item.type === "child" && pathname.includes(item.href))
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "justify-start whitespace-nowrap",
            "text-sm",
          )}
          prefetch={true}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  )
}
