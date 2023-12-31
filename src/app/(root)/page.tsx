import Link from "next/link"

import { ArrowRight, Github } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Quark
              </span>
            </h1>
            <p className="max-w-[600px] text-foreground md:text-xl">
              Your template for Next.js to create tools faster
            </p>
            <section className="flex flex-col items-center space-y-4 md:flex-row md:space-x-4 md:space-y-0">
              <Button size={"lg"} asChild>
                <Link href="/auth/login">
                  Get Started <ArrowRight className="ml-3 h-5 w-5" />
                </Link>
              </Button>
              <Button size={"lg"} variant={"outline"} asChild>
                <Link href="https://github.com/ezeparziale/quark">
                  <Github className="mr-3 h-5 w-5" />
                  GitHub
                </Link>
              </Button>
            </section>
          </div>
        </div>
      </section>
    </>
  )
}
