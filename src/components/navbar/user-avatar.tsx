import { useSession } from "next-auth/react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function UserAvatar() {
  const { data: session, status } = useSession()

  return (
    // eslint-disable-next-line tailwindcss/enforces-shorthand
    <Avatar className="h-8 w-8">
      <AvatarImage
        src={session?.user?.image as string}
        alt={session?.user?.image as string}
      />
      <AvatarFallback>{session?.user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  )
}
