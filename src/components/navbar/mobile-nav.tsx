"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { useState } from "react"

import { Menu, SlashIcon } from "lucide-react"

import { cn } from "@/lib/utils"

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import Logo from "../logo"
import ThemeSwitch from "../theme-switch"
import LoginButton from "./login-button"
import { INavigation } from "./navbar"
import ToolSwitcher from "./tool-switcher"
import UserNav from "./user-nav"

export default function MobileNav({ navigation }: { navigation: INavigation[] }) {
  const pathname = usePathname()

  const [openSheet, setOpenSheet] = useState(false)

  const isHome = pathname === "/" || pathname === "/about"

  return (
    <nav className="flex h-14 flex-1 items-center justify-between px-6 lg:hidden">
      <div className="flex items-center justify-between">
        <Logo />
        {!isHome && (
          <>
            <SlashIcon className="text-foreground/10 ml-12 size-4 -rotate-[15deg] md:mx-3" />
            <ToolSwitcher />
          </>
        )}
      </div>
      <div className="flex items-center gap-1">
        <ThemeSwitch />
        <Sheet open={openSheet} onOpenChange={setOpenSheet}>
          <SheetTrigger asChild aria-controls="radix-:Ribdd9j9:">
            <button
              type="button"
              className="text-primary -m-2.5 inline-flex cursor-pointer items-center justify-center rounded-md p-2.5"
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="size-6" aria-hidden="true" />
            </button>
          </SheetTrigger>
          <SheetTitle className="hidden" />
          <SheetDescription className="hidden" />
          <SheetContent className="fixed inset-y-0 right-0 w-full overflow-y-auto border-0 sm:border-l-2">
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y">
                {isHome && (
                  <div className="space-y-2 py-6">
                    {navigation.map((item) => (
                      <SheetClose asChild key={item.name}>
                        <Link
                          key={`sheet_close_${item.name}`}
                          href={item.href}
                          className={cn(
                            "hover:text-primary -mx-3 block px-3 py-2 text-sm font-medium transition-colors",
                            pathname != item.href && "text-muted-foreground",
                          )}
                        >
                          {item.name}
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                )}
                <div className="py-6">
                  {isHome && <LoginButton />}
                  {!isHome && <UserNav setOpenSheet={setOpenSheet} />}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}
