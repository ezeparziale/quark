import Image from "next/image"

import { Loader2 } from "lucide-react"

import Logo from "@/components/logo"
import MaxWidthWrapper from "@/components/max-width-wrapper"

export default function LoadingConfirmEmail() {
  return (
    <MaxWidthWrapper>
      <div className="mt-20 flex flex-col items-center">
        <Logo />
        <Image
          alt="confirm email"
          src={`/illustrations/home-office-white.svg`}
          width={400}
          height={400}
          className="dark:hidden"
          priority
        />
        <Image
          alt="confirm email"
          src={`/illustrations/home-office-dark.svg`}
          width={400}
          height={400}
          className="hidden dark:block"
          priority
        />
        <div className="flex items-center justify-center">
          <Loader2 className="mr-2 animate-spin text-2xl font-bold tracking-tight md:text-3xl" />
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Confirm email
          </h2>
        </div>
      </div>
    </MaxWidthWrapper>
  )
}
