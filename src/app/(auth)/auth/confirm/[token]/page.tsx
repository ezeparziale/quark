import { redirect } from "next/navigation"

export default async function ConfirmTokenPage({
  params,
}: {
  params: { token: string }
}) {
  const NEXTAUTH_URL_INTERNAL = process.env.NEXTAUTH_URL_INTERNAL

  const resp = await fetch(
    `${NEXTAUTH_URL_INTERNAL}/api/auth/confirm/${params.token}`,
    {
      next: { revalidate: 0 },
    },
  )

  if (resp.ok) {
    redirect("/auth/login?activated=1")
  } else {
    redirect("/auth/confirm?error=1")
  }
}
