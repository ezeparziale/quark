"use client"

import { useRouter, useSearchParams } from "next/navigation"

import { useEffect } from "react"

import { signOut } from "next-auth/react"

export default function Logout() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl: string = (searchParams.get("callbackUrl") as string) ?? "/"

  useEffect(() => {
    const handleLogout = async () => {
      await signOut({ redirect: true, callbackUrl: callbackUrl })
    }
    handleLogout()
  }, [router, callbackUrl])

  return null
}
