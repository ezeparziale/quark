import Link from "next/link"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function AddUserButton({ id }: { id: number }) {
  return (
    <Button size={"sm"} asChild>
      <Link href={`/admin/roles/${id}/users/add`}>
        <Plus className="h-4 w-4" />
        <span className="sr-only">add users</span>
        <span className="ml-2 hidden md:block">Add users</span>
      </Link>
    </Button>
  )
}
