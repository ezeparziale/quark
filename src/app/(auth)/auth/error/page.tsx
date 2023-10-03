"use client"

import Link from "next/link"
import { redirect, useSearchParams } from "next/navigation"

import Logo from "@/components/logo"
import { Button } from "@/components/ui/button"

const errorTypes: { [key: string]: string } = {
  AccessDenied: "Oops! This user account is blocked",
  ConfirmEmail: "Please confirm your email",
  Default: "Something went wrong!",
}

export default function Error() {
  const searchParams = useSearchParams()
  const errorParam: string | null = searchParams.get("error") as string
  const errorMessage =
    errorParam && errorTypes[errorParam] ? errorTypes[errorParam] : errorTypes.Default

  if (errorParam === "ConfirmEmail") {
    redirect("/auth/confirm")
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="rounded-lg border p-4">
        <div className="flex flex-col space-y-6">
          <Logo />
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-slate-50 md:text-2xl">
            {errorMessage}
          </h2>
          <Button asChild variant="default" size="sm" className="font-bold">
            <Link href="/auth/login">Back to login</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
