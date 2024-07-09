"use client"

import { useState } from "react"

import { Permission } from "@prisma/client"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

import PermissionDialog from "./permission-dialog"

export default function CreatePermissionButton({
  permission,
}: {
  permission?: Permission
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button onClick={() => setIsOpen(true)}>
            <Plus className="size-4" />
            <span className="sr-only">create permission</span>
            <span className="ml-2 hidden md:block">Create permission</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="md:hidden" align={"end"}>
          <p>Create permission</p>
        </TooltipContent>
      </Tooltip>
      <PermissionDialog permission={permission} isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  )
}
