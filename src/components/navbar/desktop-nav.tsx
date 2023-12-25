"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

import Logo from "../logo"
import ThemeSwitch from "../theme-switch"
import LoginButton from "./login-button"
import { INavigation } from "./navbar"

export default function DesktopNav({ navigation }: { navigation: INavigation[] }) {
  const pathname = usePathname()

  return (
    <>
      <div className="hidden items-center lg:flex lg:space-x-6">
        <Logo />

        {navigation.map((item) => (
          <Link
            key={`menu_lg_${item.name}`}
            href={item.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname != item.href && "text-muted-foreground",
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
