import Link from "next/link"

import { ArrowRight } from "lucide-react"
import { RxGithubLogo } from "react-icons/rx"

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <>
      <div className="container">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-20">
          <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Quark
            </span>
          </h1>
          <p className="max-w-[750px] text-balance text-center text-lg text-muted-foreground sm:text-xl">
            Your template for Next.js to create tools faster.
          </p>
          <section className="flex w-full items-center justify-center space-x-4 py-4 md:pb-10">
            <Button size={"sm"} asChild>
              <Link href="/auth/login">
                Get Started <ArrowRight className="ml-3 h-4 w-4" />
              </Link>
            </Button>
            <Button size={"sm"} variant={"outline"} asChild>
              <Link
                href="https://github.com/ezeparziale/quark"
                target="_blank"
                rel="noreferrer"
              >
                <RxGithubLogo className="mr-3 h-4 w-4" />
                GitHub
              </Link>
            </Button>
          </section>
        </div>
      </div>
    </>
  )
}
