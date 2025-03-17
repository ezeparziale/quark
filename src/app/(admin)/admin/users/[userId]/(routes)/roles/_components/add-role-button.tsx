import Link from "next/link"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export default function AddRoleButton({ id }: { id: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button size="sm" asChild>
          <Link
            href={`/admin/users/${id}/roles/add`}
            className="flex items-center"
            aria-label="Add roles"
            prefetch={true}
          >
            <Plus className="size-4" aria-hidden="true" />
            <span className="hidden md:inline">Add roles</span>
          </Link>
        </Button>
      </TooltipTrigger>
      <TooltipContent className="md:hidden" align="end">
        <p>Add roles</p>
      </TooltipContent>
    </Tooltip>
  )
}
