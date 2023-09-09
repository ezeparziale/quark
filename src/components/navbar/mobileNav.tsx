"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { useState } from "react"

import { cn } from "@/lib/utils"
import { Menu } from "lucide-react"

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import Logo from "../logo"
import ThemeSwitch from "../themeSwitch"

interface INavigation {
  name: string
  href: string
}
const navigation: INavigation[] = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
]

export default function MobileNav() {
  const pathname = usePathname()

  const [openSheet, setOpenSheet] = useState(false)

  return (
    <div className="flex flex-grow items-center justify-between lg:hidden">
      <div>
        <Logo />
      </div>
      <div className="flex items-center">
        <ThemeSwitch />
        <Sheet open={openSheet} onOpenChange={setOpenSheet}>
          <SheetTrigger asChild aria-controls="radix-:Ribdd9j9:">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-white"
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </SheetTrigger>
          <SheetContent className="fixed inset-y-0 right-0 w-full overflow-y-auto border-0 sm:border-l-2">
            <SheetHeader>
              <SheetTitle className="flex justify-start">
                <Logo />
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10 dark:divide-white/50">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <SheetClose asChild key={item.name}>
                      <Link
                        key={`sheet_close_${item.name}`}
                        href={item.href}
                        className={cn(
                          "-mx-3 block rounded-lg px-3 py-2 text-sm font-bold transition-colors hover:text-foreground/80",
                          pathname === item.href
                            ? "text-foreground"
                            : "text-foreground/60",
                        )}
                      >
                        {item.name}
                      </Link>
                    </SheetClose>
                  ))}
                </div>
                {/* TODO: add login button */}
                <div className="py-6"></div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
