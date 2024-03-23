import Link from "next/link"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export default function CreatePermissionButton({ ...props }) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Button asChild {...props}>
          <Link href="/admin/permissions/new">
            <Plus className="size-4" />
            <span className="sr-only">create permission</span>
            <span className="ml-2 hidden md:block">Create permission</span>
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent className="md:hidden" side="left" sideOffset={18}>
        <p>Create permission</p>
      </TooltipContent>
    </Tooltip>
  )
}
