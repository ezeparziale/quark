import Link from "next/link"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export default function AddPermissionButton({ id }: { id: number }) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Button size={"sm"} asChild>
          <Link href={`/admin/roles/${id}/permissions/add`}>
            <Plus className="h-4 w-4" />
            <span className="sr-only">add permissions</span>
            <span className="ml-2 hidden md:block">Add permissions</span>
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent className="md:hidden" align={"end"}>
        <p>Add permissions</p>
      </TooltipContent>
    </Tooltip>
  )
}
