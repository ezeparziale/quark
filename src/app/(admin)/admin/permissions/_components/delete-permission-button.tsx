"use client"

import { useState } from "react"

import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

import DeletePermissionDialog from "./delete-permission-dialog"

export default function DeletePermissionButton({
  permissionId,
  permissionKey,
}: {
  permissionId: number
  permissionKey: string
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="destructive" onClick={() => setIsOpen(true)}>
            <Trash2 className="size-4" />
            <span className="sr-only">delete permission</span>
            <span className="ml-2 hidden md:block">Delete permission</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="border-destructive md:hidden" align={"end"}>
          <p>Delete permission</p>
        </TooltipContent>
      </Tooltip>
      <DeletePermissionDialog
        permissionId={permissionId}
        permissionKey={permissionKey}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </>
  )
}
