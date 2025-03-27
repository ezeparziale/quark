import Image from "next/image"
import Link from "next/link"

import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"

import Logo from "@/components/logo"
import MaxWidthWrapper from "@/components/max-width-wrapper"

export default function Healthcheck() {
  return (
    <MaxWidthWrapper>
      <div className="mt-20 flex flex-col items-center">
        <Logo disableScale />
        <Image
          alt="missing site"
          src={`/illustrations/page-under-construction-light.svg`}
          width={400}
          height={400}
          className="dark:hidden"
        />
        <Image
          alt="missing site"
          src={`/illustrations/page-under-construction-dark.svg`}
          width={400}
          height={400}
          className="hidden dark:block"
        />
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          Under construction
        </h2>
        <Button asChild variant="default" size="sm" className="mt-6">
          <Link href="/">
            <ArrowLeft className="size-4" />
            Back to home
          </Link>
        </Button>
      </div>
    </MaxWidthWrapper>
  )
}
