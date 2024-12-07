"use client"

import { useRouter } from "next/navigation"

import { useState } from "react"

import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { setTemporaryPassword } from "@/actions/users/password-reset"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SetTemporaryPasswordCard({ userId }: { userId: number }) {
  const [isOpen, setIsOpen] = useState(false)
  const [temporaryPassword, setTempPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  const handleSetTemporaryPassword = async () => {
    if (!temporaryPassword) {
      toast.error("Please enter a temporary password.")
      return
    }

    setIsLoading(true)
    try {
      await setTemporaryPassword(userId, temporaryPassword)
      setIsOpen(false)
      toast.success("Temporary password has been set successfully!")
      router.refresh()
    } catch {
      toast.error("Failed to set temporary password. Please try again.")
    } finally {
      setIsLoading(false)
      setTempPassword("")
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) setTempPassword("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set temporary password</CardTitle>
        <CardDescription>Set a temporary password for the user</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => setIsOpen(true)}>Set temporary password</Button>
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set temporary password</DialogTitle>
              <DialogDescription>
                Enter a temporary password for the user. They will be required to change
                it on next login.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="temporary-password">Password</Label>
                <Input
                  id="temporary-password"
                  type="password"
                  className="col-span-3"
                  value={temporaryPassword}
                  onChange={(e) => setTempPassword(e.target.value)}
                  aria-label="Temporary Password"
                  disabled={isLoading}
                />
              </div>
            </div>
            <DialogFooter className="gap-y-2">
              <Button variant="outline" onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSetTemporaryPassword}
                disabled={!temporaryPassword || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Setting...
                  </>
                ) : (
                  "Set password"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
