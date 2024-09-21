"use client"

import { useState } from "react"

import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

import DeleteRoleDialog from "../../_components/delete-role-dialog"

export default function DeleteRoleButton({
  roleId,
  roleKey,
}: {
  roleId: number
  roleKey: string
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
      <DeleteRoleDialog
        roleId={roleId}
        roleKey={roleKey}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </>
  )
}
