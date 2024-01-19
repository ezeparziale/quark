import Link from "next/link"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function CreateUserButton() {
  return (
    <Button asChild>
      <Link href="/admin/users/new">
        <Plus className="h-4 w-4" />
        <span className="sr-only">create user</span>
        <span className="ml-2 hidden md:block">User</span>
      </Link>
    </Button>
  )
}
