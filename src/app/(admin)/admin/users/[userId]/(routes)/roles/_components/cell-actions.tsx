import { useRouter } from "next/navigation"

import React, { useState, useTransition } from "react"

import { Loader2, MoreHorizontal } from "lucide-react"
import { toast } from "sonner"

import { removeRolToUser } from "@/actions/users/remove-role"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { IColumns } from "./columns"

export default function CellActions({ row }: { row: IColumns }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [open, setIsOpen] = useState(false)

  const { roleId, userId } = row!
  const name = row?.role.name

  function handleConfirmation() {
    startTransition(async () => {
      const result = await removeRolToUser({ roleId, userId })
      if (result.success) {
        setIsOpen(false)
        toast.success("Role removed successfully!")
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 p-2 data-[state=open]:bg-muted">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(String(roleId))}
          >
            Copy role ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push(`/admin/roles/${roleId}`)}>
            View role
          </DropdownMenuItem>
          <DialogTrigger asChild>
            <DropdownMenuItem>Remove role</DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Remove role</DialogTitle>
          <DialogDescription>
            Are you sure to remove this role: <span className="font-bold">{name}</span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => {
              setIsOpen(false)
            }}
            type="button"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="destructive"
            onClick={() => handleConfirmation()}
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
