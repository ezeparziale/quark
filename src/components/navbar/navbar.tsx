"use client"

import { useEffect, useState } from "react"

import { useMotionValueEvent, useScroll } from "framer-motion"

import { cn } from "@/lib/utils"

import DesktopNav from "./desktop-nav"
import MobileNav from "./mobile-nav"

export interface INavigation {
  name: string
  href: string
}
const navigation: INavigation[] = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
]

export default function Navbar() {
  const [showStickyNav, setShowStickyNav] = useState(false)
  const [mounted, setMounted] = useState(false)

  const { scrollY } = useScroll()
  const [y, setY] = useState(0)

  useMotionValueEvent(scrollY, "change", (latest) => {
    setY(latest)
  })

  useEffect(() => {
    if (!mounted) {
      setMounted(true)
    } else {
      const isNavTabsUsed = document.querySelector("#nav-tabs") !== null
      setShowStickyNav(!isNavTabsUsed)
    }
  }, [mounted])

  return (
    <header
      className={cn(
        showStickyNav &&
          "bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-40 flex h-14 items-center justify-start overflow-x-auto backdrop-blur-sm",
        !showStickyNav && "flex h-14 w-full",
        y > 56 &&
          "after:bg-border after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:content-['']",
      )}
    >
      <DesktopNav navigation={navigation} />
      <MobileNav navigation={navigation} />
    </header>
  )
}
