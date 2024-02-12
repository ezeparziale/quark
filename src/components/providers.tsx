"use client"

import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "next-themes"

import { TooltipProvider } from "./ui/tooltip"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SessionProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </SessionProvider>
    </>
  )
}
