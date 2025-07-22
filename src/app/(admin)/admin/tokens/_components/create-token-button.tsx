"use client"

import { useState } from "react"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { CreateTokenDialog } from "./create-token-dialog"

export default function CreateTokenButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button onClick={() => setIsOpen(true)}>
            <Plus className="size-4" />
            <span className="sr-only">create token</span>
            <span className="hidden md:block">Create token</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="md:hidden" align={"end"}>
          <p>Create token</p>
        </TooltipContent>
      </Tooltip>
      <CreateTokenDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </TooltipProvider>
  )
}
