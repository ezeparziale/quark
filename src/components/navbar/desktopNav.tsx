"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

import Logo from "../logo"
import ThemeSwitch from "../themeSwitch"
import LoginButton from "./loginButton"

interface INavigation {
  name: string
  href: string
}
const navigation: INavigation[] = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
]

export default function DesktopNav() {
  const pathname = usePathname()

  return (
    <>
      <div className="hidden items-center lg:flex lg:gap-x-6">
        <Logo />

        {navigation.map((item) => (
          <Link
            key={`menu_lg_${item.name}`}
            href={item.href}
            className={cn(
              "text-sm font-bold transition-colors hover:text-foreground/80",
              pathname === item.href ? "text-foreground" : "text-foreground/60",
            )}
          >
            {item.name}
          </Link>
        ))}
      </div>
      <div className="hidden lg:flex lg:flex-1 lg:justify-end">
        <ThemeSwitch />
        <LoginButton />
      </div>
    </>
  )
}
