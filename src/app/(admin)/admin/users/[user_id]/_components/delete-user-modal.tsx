"use client"

import { useRouter } from "next/navigation"

import { useState } from "react"

import { deleteUser } from "@/actions/users/update-user"
import type { User } from "@prisma/client"
import { Trash2 } from "lucide-react"
import { useSession } from "next-auth/react"

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

export default function DeleteUserModal({ user }: { user: User }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const buttonDisable = user.email === session?.user.email ? true : false

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" disabled={buttonDisable}>
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">delete user</span>
          <span className="ml-2 hidden md:block">Delete</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete user</DialogTitle>
          <DialogDescription>
            Are you sure to delete user: <span className="font-bold">{user.email}</span>
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
              deleteUser(user)
              setIsOpen(false)
              router.push("/admin/users")
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
