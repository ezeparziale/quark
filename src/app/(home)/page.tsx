import Link from "next/link"

import { ArrowRight } from "lucide-react"
import { RxGithubLogo } from "react-icons/rx"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <>
      <div className="container">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
          <Badge variant="secondary">Built with Next.js 15 🎉</Badge>
          <h1 className="text-center text-3xl leading-tight font-bold tracking-tighter md:text-6xl lg:leading-[1.1]">
            Welcome to{" "}
            <span className="bg-linear-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Quark
            </span>
          </h1>
          <p className="text-muted-foreground max-w-[750px] text-center text-lg text-balance sm:text-xl">
            Your template for Next.js to create tools faster.
          </p>
          <div className="flex w-full flex-col items-center justify-center space-y-4 py-4 sm:flex-row sm:space-y-0 sm:space-x-4 md:pb-10">
            <Button size="sm" asChild className="w-full sm:w-auto">
              <Link href="/auth/login">
                Get Started <ArrowRight className="ml-3 size-4" />
              </Link>
            </Button>
            <Button size="sm" variant="outline" asChild className="w-full sm:w-auto">
              <Link
                href="https://github.com/ezeparziale/quark"
                target="_blank"
                rel="noreferrer"
              >
                <RxGithubLogo className="mr-3 size-4" />
                GitHub
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
