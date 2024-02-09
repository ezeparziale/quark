import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function LoginButton() {
  return (
    <div className="flex space-x-1">
      <Button asChild variant="outline" size="default">
        <Link href="/auth/login">Log in</Link>
      </Button>
      <Button asChild variant="default" size="default">
        <Link href="/auth/register">Sign up</Link>
      </Button>
    </div>
  )
}
