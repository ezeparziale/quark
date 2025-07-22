"use client"

import { Button } from "@/components/ui/button"
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { CopyButton } from "./copy-button"

interface TokenDisplayProps {
  token: string
  setIsOpen: (open: boolean) => void
}

export function TokenDisplay({ token, setIsOpen }: TokenDisplayProps) {
  return (
    <>
      <DialogHeader className="text-left">
        <DialogTitle>Token generated successfully</DialogTitle>
        <DialogDescription>
          Please save this token now.
          <br />
          You won&apos;t be able to view it again.
        </DialogDescription>
      </DialogHeader>

      <div className="flex items-center space-x-2 px-4 sm:px-0">
        <div className="grid flex-1 gap-2">
          <Label htmlFor="token" className="sr-only">
            Token
          </Label>
          <Input id="token" defaultValue={token} readOnly />
        </div>
        <CopyButton
          textToCopy={token}
          successMessage="Token copied to clipboard!"
          label="Copy token"
        />
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" onClick={() => setIsOpen(false)}>
            Finish
          </Button>
        </DialogClose>
      </DialogFooter>
    </>
  )
}
