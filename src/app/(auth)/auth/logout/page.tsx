"use client"

import { useRouter, useSearchParams } from "next/navigation"

import { Suspense, useEffect } from "react"

import { signOut } from "next-auth/react"

function Logout() {
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
export default function LogoutPage() {
  return (
    <Suspense>
      <Logout />
    </Suspense>
  )
}
