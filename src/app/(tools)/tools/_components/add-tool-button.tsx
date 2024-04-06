import React from "react"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export default function AddToolButton() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button>
          <Plus className="size-4" />
          <span className="sr-only">add new tool</span>
          <span className="ml-2 hidden md:block">Add new tool</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent className="md:hidden" align={"end"}>
        <p>Add new tool</p>
      </TooltipContent>
    </Tooltip>
  )
}
