"use client"

import { useState } from "react"

import { MoreHorizontal } from "lucide-react"

import type { Token } from "@/types/token"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { TokenDetailsModal } from "./token-details-modal"

interface TokenActionsCellProps {
  token: Token
}

export function TokenActionsCell({ token }: TokenActionsCellProps) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(token.id)}>
            Copy token ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowDetails(true)}>
            View details
          </DropdownMenuItem>
          <DropdownMenuItem>Edit token</DropdownMenuItem>
          <DropdownMenuItem className="text-destructive">Delete token</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <TokenDetailsModal
        token={token}
        open={showDetails}
        onOpenChange={setShowDetails}
      />
    </>
  )
}
