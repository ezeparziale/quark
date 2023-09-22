import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { cn } from "@/lib/utils"

import { Toaster } from "@/components/ui/toaster"

import "@/styles/globals.css"

import Providers from "./providers"

const font = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Quark",
  description: "Quark template",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background antialiased", font.className)}>
        <div className="relative flex min-h-screen flex-col">
          <Providers>
            <div className="flex-1">{children}</div>
            <Toaster />
          </Providers>
        </div>
      </body>
    </html>
  )
}
