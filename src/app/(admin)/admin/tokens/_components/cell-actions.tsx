import { useState } from "react"

import { MoreHorizontal, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { IColumns } from "./columns"
import DeleteTokenDialog from "./delete-token-dialog"

export default function CellActions({ row }: { row: IColumns }) {
  const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  return (
    <>
      <DropdownMenu open={isDropdownMenuOpen} onOpenChange={setIsDropdownMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 p-2 data-[state=open]:bg-muted">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onSelect={() => {
              setIsDeleteDialogOpen(true)
              setIsDropdownMenuOpen(false)
            }}
            className="hover:!bg-destructive/80 hover:!text-destructive-foreground"
          >
            <Trash className="mr-2 size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteTokenDialog
        key={`delete-${row.id}`}
        tokenId={row.id}
        tokenName={row.name}
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
      />
    </>
  )
}
