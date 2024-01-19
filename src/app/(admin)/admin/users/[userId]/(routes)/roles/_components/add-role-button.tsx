import Link from "next/link"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function AddRoleButton({ id }: { id: string }) {
  return (
    <Button size={"sm"} asChild>
      <Link href={`/admin/users/${id}/roles/add`}>
        <Plus className="h-4 w-4" />
        <span className="sr-only">add roles</span>
        <span className="ml-2 hidden md:block">Add roles</span>
      </Link>
    </Button>
  )
}
