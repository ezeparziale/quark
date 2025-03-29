import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

import { cn } from "@/lib/utils"

import { Toaster } from "@/components/ui/sonner"

import Providers from "@/components/providers"

import "@/styles/globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Quark",
  description: "Quark template",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "bg-background min-h-screen antialiased",
          geistSans.variable,
          geistMono.variable,
          geistSans.className,
        )}
      >
        <div className="relative flex min-h-screen flex-col">
          <Providers>
            <div className="flex-1">
              {children}
              <SpeedInsights />
              <Analytics />
            </div>
            <Toaster richColors position="top-center" />
          </Providers>
        </div>
      </body>
    </html>
  )
}
