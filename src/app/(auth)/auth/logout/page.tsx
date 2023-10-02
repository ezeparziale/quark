"use client"

import { useRouter } from "next/navigation"

import { useEffect } from "react"

import { signOut } from "next-auth/react"

export default function Logout() {
  const router = useRouter()
  useEffect(() => {
    const handleLogout = async () => {
      await signOut({ redirect: true, callbackUrl: "/" })
    }
    handleLogout()
  }, [router])

  return null
}
