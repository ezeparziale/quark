import { useRouter } from "next/navigation"

import React, { useState, useTransition } from "react"

import { Loader2, MoreHorizontal } from "lucide-react"
import { toast } from "sonner"

import { removeUser } from "@/actions/roles"

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
  const email = row?.user.email

  async function handleConfirmation() {
    startTransition(async () => {
      const result = await removeUser({ roleId, userId })
      if (result.success) {
        setIsOpen(false)
        toast.success("User removed successfully!")
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(String(userId))}
          >
            Copy user ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push(`/admin/users/${userId}`)}>
            View user
          </DropdownMenuItem>
          <DialogTrigger asChild>
            <DropdownMenuItem>Remove user</DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Remove user</DialogTitle>
          <DialogDescription>
            Are you sure to remove this user: <span className="font-bold">{email}</span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => {
              setIsOpen(false)
            }}
            type="button"
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="destructive"
            onClick={() => handleConfirmation()}
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
