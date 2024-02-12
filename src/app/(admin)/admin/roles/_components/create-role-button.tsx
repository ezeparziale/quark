import Link from "next/link"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export default function CreateRoleButton() {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Button asChild>
          <Link href="/admin/roles/new">
            <Plus className="size-4" />
            <span className="sr-only">create role</span>
            <span className="ml-2 hidden md:block">Create role</span>
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent className="md:hidden" side="left" sideOffset={18}>
        <p>Create role</p>
      </TooltipContent>
    </Tooltip>
  )
}
