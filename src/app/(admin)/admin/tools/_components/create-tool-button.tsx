import Link from "next/link"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export default function CreateToolButton() {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Button asChild>
          <Link href="/admin/tools/new">
            <Plus className="size-4" />
            <span className="sr-only">create tool</span>
            <span className="ml-2 hidden md:block">Create tool</span>
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent className="md:hidden" align={"end"}>
        <p>Create tool</p>
      </TooltipContent>
    </Tooltip>
  )
}
