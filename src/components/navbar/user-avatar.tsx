import { useSession } from "next-auth/react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function UserAvatar() {
  const { data: session } = useSession()

  return (
    <Avatar className="h-8 w-8">
      <AvatarImage src={session?.user?.image as string} alt={"User profile menu"} />
      <AvatarFallback>{session?.user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  )
}
