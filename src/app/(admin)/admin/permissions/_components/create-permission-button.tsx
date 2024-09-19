import Link from "next/link"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export default function CreatePermissionButton() {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Button asChild>
          <Link href="/admin/permissions/new" prefetch={true}>
            <Plus className="size-4" />
            <span className="sr-only">create permission</span>
            <span className="ml-2 hidden md:block">Create permission</span>
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent className="md:hidden" align={"end"}>
        <p>Create permission</p>
      </TooltipContent>
    </Tooltip>
  )
}
