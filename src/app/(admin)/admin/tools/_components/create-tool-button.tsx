"use client"

import { useState } from "react"

import { Tool } from "@prisma/client"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

import ToolDialog from "./tool-dialog"

export default function CreateToolButton({ tool }: { tool?: Tool }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button onClick={() => setIsOpen(true)}>
            <Plus className="size-4" />
            <span className="sr-only">create tool</span>
            <span className="ml-2 hidden md:block">Create tool</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="md:hidden" align={"end"}>
          <p>Create tool</p>
        </TooltipContent>
      </Tooltip>
      <ToolDialog tool={tool} isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  )
}
