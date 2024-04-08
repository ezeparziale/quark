"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { SlashIcon } from "lucide-react"

import FeedbackButton from "../feedback-button"
import Logo from "../logo"
import ThemeSwitch from "../theme-switch"
import LoginButton from "./login-button"
import { INavigation } from "./navbar"
import ToolSwitcher from "./tool-switcher"
import UserNav from "./user-nav"

export default function DesktopNav({ navigation }: { navigation: INavigation[] }) {
  const pathname = usePathname()
  const isHome = pathname === "/" || pathname === "/about"

  return (
    <>
      <nav className="hidden h-14 items-center justify-between px-6 lg:flex lg:flex-1">
        <div className="flex items-center space-x-6 pr-6">
          <Logo />
          {isHome &&
            navigation.map((item) => (
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
          {!isHome && (
            <>
              <SlashIcon className="mx-3 hidden size-4 -rotate-[15deg] text-foreground/10 md:block" />
              <ToolSwitcher />
            </>
          )}
        </div>
        <div className="flex space-x-3">
          {!isHome && <FeedbackButton />}
          <ThemeSwitch />
          {isHome && <LoginButton />}
          {!isHome && <UserNav />}
        </div>
      </nav>
    </>
  )
}
