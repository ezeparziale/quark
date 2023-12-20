"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"

import { useEffect, useRef, useState } from "react"

import { Loader2 } from "lucide-react"

import Container from "@/components/container"
import Logo from "@/components/logo"

export default function ChangeEmailTokenPage({
  params,
}: {
  params: { token: string }
}) {
  const router = useRouter()
  const [isLoading, setLoading] = useState(true)
  const effectRan = useRef(0)

  useEffect(() => {
    if (effectRan.current != 0) {
      fetch(`/api/auth/change-email/${params.token}`, {
        next: { revalidate: 0 },
      }).then((res) => {
        if (res.status === 201) {
          setLoading(false)
          router.push("/auth/logout?callbackUrl=/auth/login?updatedEmail=1")
        } else {
          router.push("/auth/error")
        }
      })
    }
    effectRan.current++
  }, [params.token, router])

  if (isLoading)
    return (
      <Container>
        <div className="mt-20 flex flex-col items-center">
          <Logo />
          <Image
            alt="changing email"
            src={`/illustrations/home-office-white.svg`}
            width={400}
            height={400}
            className="dark:hidden"
            priority
          />
          <Image
            alt="changing email"
            src={`/illustrations/home-office-dark.svg`}
            width={400}
            height={400}
            className="hidden dark:block"
            priority
          />
          <div className="flex items-center justify-center">
            <Loader2 className="mr-2 animate-spin text-2xl font-bold tracking-tight md:text-3xl" />
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Changing email
            </h2>
          </div>
        </div>
      </Container>
    )
}
