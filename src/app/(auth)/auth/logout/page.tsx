"use client"

import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Logout() {
  const router = useRouter()
  useEffect(() => {
    const handleLogout = async () => {
      await signOut({ redirect: false })
      router.push("/")
    }
    handleLogout()
  }, [router])

  return null
}
