"use client"

import { useRouter } from "next/navigation"

import { useState } from "react"

import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { checkUserPassword, resetUserPassword } from "@/actions/users/password-reset"

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

export function ResetPasswordCard({ userId }: { userId: number }) {
  const [isOpen, setIsOpen] = useState(false)
  const [hasPassword, setHasPassword] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingCheckPassword, setIsLoadingCheckPassword] = useState(false)

  const router = useRouter()

  const handleResetClick = async () => {
    setIsLoadingCheckPassword(true)
    const userHasPassword = await checkUserPassword(userId)
    setHasPassword(userHasPassword)
    setIsOpen(true)
    setIsLoadingCheckPassword(false)
  }

  const handleConfirmReset = async () => {
    setIsLoading(true)
    await resetUserPassword(userId)
    setIsOpen(false)
    router.refresh()
    toast.success("Password reset successfully!")
    setIsLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reset user password</CardTitle>
        <CardDescription>Reset the user&apos;s password to blank</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleResetClick} disabled={isLoadingCheckPassword}>
          <>
            {isLoadingCheckPassword && <Loader2 className="mr-2 size-4 animate-spin" />}
            Reset password
          </>
        </Button>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            {hasPassword ? (
              <>
                <DialogHeader>
                  <DialogTitle>Confirm password reset</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to reset this user&apos;s password?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-y-2">
                  <Button variant="outline" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleConfirmReset} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Resetting...
                      </>
                    ) : (
                      "Reset password"
                    )}
                  </Button>
                </DialogFooter>
              </>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle>Cannot reset password</DialogTitle>
                  <DialogDescription>
                    This user does not have a password set. There&apos;s nothing to
                    reset.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button onClick={() => setIsOpen(false)}>Close</Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
