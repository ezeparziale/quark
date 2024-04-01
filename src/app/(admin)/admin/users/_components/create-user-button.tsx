import Link from "next/link"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export default function CreateUserButton() {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Button asChild>
          <Link href="/admin/users/new">
            <Plus className="size-4" />
            <span className="sr-only">create user</span>
            <span className="ml-2 hidden md:block">Create user</span>
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent className="md:hidden" align={"end"}>
        <p>Create user</p>
      </TooltipContent>
    </Tooltip>
  )
}
