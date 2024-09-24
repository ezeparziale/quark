"use client"

import { useState } from "react"

import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

import DeleteUserDialog from "../../_components/delete-user-dialog"

export default function DeleteUserButton({
  userId,
  userEmail,
}: {
  userId: number
  userEmail: string
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="destructive" onClick={() => setIsOpen(true)}>
            <Trash2 className="size-4" />
            <span className="sr-only">delete user</span>
            <span className="ml-2 hidden md:block">Delete user</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="border-destructive md:hidden" align={"end"}>
          <p>Delete user</p>
        </TooltipContent>
      </Tooltip>
      <DeleteUserDialog
        userId={userId}
        userEmail={userEmail}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </>
  )
}
