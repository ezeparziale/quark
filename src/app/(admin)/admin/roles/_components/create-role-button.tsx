import Link from "next/link"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export default function CreateRoleButton() {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Button asChild>
          <Link href="/admin/roles/new" prefetch={true}>
            <Plus className="size-4" />
            <span className="sr-only">create role</span>
            <span className="hidden md:block">Create role</span>
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent className="md:hidden" align={"end"}>
        <p>Create role</p>
      </TooltipContent>
    </Tooltip>
  )
}
