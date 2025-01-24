"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { useMemo, useState } from "react"

import { motion, useMotionValueEvent, useScroll } from "framer-motion"

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

  const { scrollY } = useScroll()
  const [y, setY] = useState(0)

  useMotionValueEvent(scrollY, "change", (latest) => {
    setY(latest)
  })

  const useRange = (
    num: number,
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number,
  ) => {
    const mappedValue = useMemo(() => {
      const newValue = ((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
      const largest = Math.max(outMin, outMax)
      const smallest = Math.min(outMin, outMax)
      return Math.min(Math.max(newValue, smallest), largest)
    }, [inMax, inMin, num, outMax, outMin])

    return mappedValue
  }

  const navX = useRange(y, 0, 50, 0, 50)

  const durationX = y === 0 ? 0.25 : null

  return (
    <nav
      id="nav-tabs"
      className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky -top-1 z-40 mb-[-3px] flex h-[46px] items-center justify-start space-x-1 overflow-x-auto border-b px-4 backdrop-blur-sm"
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="relative h-[44px]"
          style={{
            transform: `translateX(${navX}px)`,
          }}
          prefetch={true}
        >
          <div className="hover:bg-muted m-1 rounded-md px-3 py-2 transition-all duration-75">
            <p
              className={cn(
                "text-muted-foreground hover:text-primary text-sm font-normal",
                ((item.type === "parent" && pathname === item.href) ||
                  (item.type === "child" && pathname.includes(item.href))) &&
                  "text-primary",
              )}
            >
              {item.title}
            </p>
          </div>
          {((item.type === "parent" && pathname === item.href) ||
            (item.type === "child" && pathname.includes(item.href))) && (
            <motion.div
              layoutId="indicator"
              transition={{
                duration: durationX,
              }}
              className="absolute bottom-0 w-full px-1.5"
            >
              <div className="bg-primary h-0.5" />
            </motion.div>
          )}
        </Link>
      ))}
    </nav>
  )
}
