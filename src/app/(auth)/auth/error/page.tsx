import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"

import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"

import Logo from "@/components/logo"
import MaxWidthWrapper from "@/components/max-width-wrapper"

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

type SearchParams = Promise<{ error: string }>

export default async function Error(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams

  const errorParam: string | null = searchParams.error
  const errorMessage =
    errorParam && errorTypes[errorParam] ? errorTypes[errorParam] : errorTypes.Default

  if (errorParam === "ConfirmEmail") {
    redirect("/auth/confirm")
  }

  return (
    <MaxWidthWrapper>
      <div className="mt-20 flex flex-col items-center">
        <Logo disableScale />
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
            <ArrowLeft className="size-4" />
            Back to home
          </Link>
        </Button>
      </div>
    </MaxWidthWrapper>
  )
}
