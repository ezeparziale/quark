import Link from "next/link"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function CreateRoleButton() {
  return (
    <Button asChild>
      <Link href="/admin/roles/new">
        <Plus className="h-4 w-4" />
        <span className="sr-only">create role</span>
        <span className="ml-2 hidden md:block">Create</span>
      </Link>
    </Button>
  )
}
