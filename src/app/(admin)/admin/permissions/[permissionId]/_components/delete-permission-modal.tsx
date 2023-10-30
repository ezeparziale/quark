"use client"

import { useRouter } from "next/navigation"

import { useState } from "react"

import { deletePermission } from "@/actions/permissions/delete"
import type { Permission } from "@prisma/client"
import { Trash2 } from "lucide-react"

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

export default function DeleteUserModal({ permission }: { permission: Permission }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="ml-2">
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">delete permission</span>
          <span className="ml-2 hidden md:block">Delete</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete permission</DialogTitle>
          <DialogDescription>
            Are you sure to delete permission:{" "}
            <span className="font-bold">{permission.name}</span>
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
            onClick={() => {
              deletePermission(permission)
              setIsOpen(false)
              router.push("/admin/permissions")
              router.refresh()
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
