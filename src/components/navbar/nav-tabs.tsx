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

export default function NavTabs({ items }: NavProps) {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 h-[56px] border-b bg-background">
      <div
        className="container flex w-full max-w-screen-2xl items-center"
        aria-label="sub-header"
      >
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative inline-block cursor-pointer text-sm font-normal text-muted-foreground no-underline transition-all duration-200",
              ((item.type === "parent" && pathname === item.href) ||
                (item.type === "child" && pathname.includes(item.href))) &&
                "text-primary before:absolute before:inset-x-[9px] before:-bottom-1 before:block before:h-0 before:border-b-2 before:border-solid before:border-primary before:content-['']",
            )}
          >
            <div className="my-2 rounded-md px-3 py-2 hover:bg-muted">{item.title}</div>
          </Link>
        ))}
      </div>
    </nav>
  )
}
