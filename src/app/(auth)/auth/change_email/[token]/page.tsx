"use client"

import { useRouter } from "next/navigation"

import { useEffect, useRef, useState } from "react"

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
      fetch(`/api/auth/change_email/${params.token}`, {
        next: { revalidate: 0 },
      }).then((res) => {
        if (res.status === 201) {
          setLoading(false)
          router.push("/auth/logout")
        } else {
          router.push("/auth/error")
        }
      })
    }
    effectRan.current++
  }, [params.token, router])

  if (isLoading) return <p>Changing email...</p>
}
