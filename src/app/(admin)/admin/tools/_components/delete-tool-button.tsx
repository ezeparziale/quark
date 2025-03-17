"use client"

import { useState } from "react"

import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

import DeleteToolDialog from "./delete-tool-dialog"

export default function DeleteToolButton({
  toolId,
  toolName,
}: {
  toolId: number
  toolName: string
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="destructive" onClick={() => setIsOpen(true)}>
            <Trash2 className="size-4" />
            <span className="sr-only">delete tool</span>
            <span className="hidden md:block">Delete tool1</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="border-destructive md:hidden" align={"end"}>
          <p>Delete tool</p>
        </TooltipContent>
      </Tooltip>
      <DeleteToolDialog
        toolId={toolId}
        toolName={toolName}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </>
  )
}
