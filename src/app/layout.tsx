import type { Metadata } from "next"

import { cn } from "@/lib/utils"
import { GeistSans } from "geist/font/sans"

import Providers from "@/components/providers"
import { Toaster } from "@/components/ui/sonner"

import "@/styles/globals.css"

export const metadata: Metadata = {
  title: "Quark",
  description: "Quark template",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn("min-h-screen bg-background antialiased", GeistSans.className)}
      >
        <div className="relative flex min-h-screen flex-col">
          <Providers>
            <div className="flex-1">{children}</div>
            <Toaster richColors closeButton />
          </Providers>
        </div>
      </body>
    </html>
  )
}
