import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"

import { ArrowLeft } from "lucide-react"

import Logo from "@/components/logo"
import MaxWidthWrapper from "@/components/max-width-wrapper"
import { Button } from "@/components/ui/button"

const errorTypes: { [key: string]: { message: string; img?: string } } = {
  AccessDenied: {
    message: "Oops! This user account is blocked",
    img: "calling-help",
  },
  AccessUnauthorized: {
    message: "Oops! Access Unauthorized",
    img: "calling-help",
  },
  ConfirmEmail: { message: "Please confirm your email" },
  TokenExpired: { message: "Oops! Token expired", img: "crashed-error" },
  Default: { message: "Something went wrong!", img: "crashed-error" },
}

export default function Error({ searchParams }: { searchParams: { error: string } }) {
  const errorParam: string | null = searchParams.error
  const errorMessage =
    errorParam && errorTypes[errorParam] ? errorTypes[errorParam] : errorTypes.Default

  if (errorParam === "ConfirmEmail") {
    redirect("/auth/confirm")
  }

  return (
    <MaxWidthWrapper>
      <div className="mt-20 flex flex-col items-center">
        <Logo />
        <Image
          alt="missing site"
          src={`/error/${errorMessage.img}-gray.svg`}
          width={400}
          height={400}
          className="dark:hidden"
          priority
        />
        <Image
          alt="missing site"
          src={`/error/${errorMessage.img}-white.svg`}
          width={400}
          height={400}
          className="hidden dark:block"
          priority
        />
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          {errorMessage.message}
        </h2>
        <Button asChild variant="default" size="sm" className="mt-6">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
        </Button>
      </div>
    </MaxWidthWrapper>
  )
}
