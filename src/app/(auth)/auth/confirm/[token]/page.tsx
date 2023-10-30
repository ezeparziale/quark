import { redirect } from "next/navigation"

import { env } from "@/env.mjs"

export default async function ConfirmTokenPage({
  params,
}: {
  params: { token: string }
}) {
  const resp = await fetch(`${env.NEXTAUTH_URL}/api/auth/confirm/${params.token}`, {
    next: { revalidate: 0 },
  })

  if (resp.ok) {
    redirect("/auth/login?activated=1")
  } else {
    redirect("/auth/confirm?error=1")
  }
}
