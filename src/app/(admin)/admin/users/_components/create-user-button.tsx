import Link from "next/link"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export default function CreateUserButton() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button asChild>
          <Link
            href="/admin/users/new"
            className="flex items-center"
            aria-label="Create user"
          >
            <Plus className="size-4" aria-hidden="true" />
            <span className="ml-2 hidden md:inline">Create user</span>
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent className="md:hidden" align="end">
        <p>Create user</p>
      </TooltipContent>
    </Tooltip>
  )
}
