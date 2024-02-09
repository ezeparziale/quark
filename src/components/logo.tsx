"use client"

import Image from "next/image"
import Link from "next/link"

import { useMemo, useState } from "react"

import { cn } from "@/lib/utils"
import { useMotionValueEvent, useScroll } from "framer-motion"

export default function Logo({ disableScale }: { disableScale?: boolean }) {
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
    }, [num])

    return mappedValue
  }

  const scale = useRange(y, 0, 50, 1, 0.6)
  const logoScale = disableScale ? 0.8 : scale

  return (
    <div className="flex justify-center">
      <Link href="/">
        <div className="flex items-center space-x-2">
          <Image
            src={`/logo/logo-light.svg`}
            alt={"logo"}
            width={40}
            height={40}
            className={cn(
              " z-50 block dark:hidden",
              !disableScale && "fixed left-6 top-3",
            )}
            style={{
              width: `${40 * logoScale}px`,
            }}
          />

          <Image
            src={`/logo/logo-dark.svg`}
            alt={"logo"}
            width={40}
            height={40}
            className={cn(
              " z-50 hidden dark:block",
              !disableScale && "fixed left-6 top-3",
            )}
            style={{
              width: `${40 * logoScale}px`,
            }}
          />
          <span className="sr-only">quark</span>
          <p
            className={cn(
              "hidden font-bold text-primary antialiased sm:text-sm md:block md:text-2xl lg:text-2xl",
              !disableScale && "pl-12",
            )}
          >
            quark
          </p>
        </div>
      </Link>
    </div>
  )
}
