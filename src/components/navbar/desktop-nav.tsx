"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { SlashIcon } from "lucide-react"
import { useSession } from "next-auth/react"

import Logo from "../logo"
import ThemeSwitch from "../theme-switch"
import LoginButton from "./login-button"
import { INavigation } from "./navbar"
import ToolSwitcher from "./tool-switcher"

export default function DesktopNav({ navigation }: { navigation: INavigation[] }) {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <>
      <div className="hidden items-center lg:flex">
        <Logo />
        {!session &&
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
        <SlashIcon className="mx-3 hidden size-4 -rotate-[15deg] text-foreground/10 md:block" />
        {session && <ToolSwitcher />}
      </div>
      <div className="hidden lg:flex lg:flex-1 lg:justify-end">
        <ThemeSwitch />
        <LoginButton />
      </div>
    </>
  )
}
