"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

interface NavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
    type: "parent" | "child"
  }[]
}

export default function HeaderHav({ items }: NavProps) {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background">
      <nav
        className="container flex h-14 max-w-screen-2xl items-center"
        aria-label="sub-header"
      >
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "inline-block border-b-2 p-3",
              "text-sm font-medium",
              (item.type === "parent" && pathname === item.href) ||
                (item.type === "child" && pathname.includes(item.href))
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground",
            )}
          >
            {item.title}
          </Link>
        ))}
      </nav>
    </header>
  )
}
