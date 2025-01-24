import Link from "next/link"

import React, { useState, useTransition } from "react"

import { Copy, Eye, Loader2, MoreHorizontal, Trash } from "lucide-react"
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
          <Button variant="ghost" className="data-[state=open]:bg-muted h-8 p-2">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(String(roleId))}
          >
            <Copy className="mr-2 size-4" />
            Copy role ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/admin/roles/${roleId}`} prefetch={true}>
              <Eye className="mr-2 size-4" />
              View role
            </Link>
          </DropdownMenuItem>
          <DialogTrigger asChild>
            <DropdownMenuItem className="hover:bg-destructive/80! hover:text-destructive-foreground!">
              <Trash className="mr-2 size-4" />
              Remove role
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Remove role?</DialogTitle>
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
            {isPending ? "Removing..." : "Remove"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
