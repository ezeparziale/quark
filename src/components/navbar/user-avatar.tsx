import { useSession } from "next-auth/react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function UserAvatar() {
  const { data: session, status } = useSession()

  return (
    <Avatar>
      <AvatarImage
        src={session?.user?.image as string}
        alt={session?.user?.image as string}
      />
      <AvatarFallback>{session?.user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  )
}
