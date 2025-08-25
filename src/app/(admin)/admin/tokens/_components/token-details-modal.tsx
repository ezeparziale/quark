"use client"

import { format } from "date-fns"

import type { Token } from "@/types/token"

import { useMediaQuery } from "@/lib/hooks/use-media-query"

import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"

interface TokenDetailsModalProps {
  token: Token | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TokenDetailsModal({
  token,
  open,
  onOpenChange,
}: TokenDetailsModalProps) {
  const { isMobile } = useMediaQuery()

  if (!token) return null

  const TokenDetails = () => (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="space-y-2">
          <label className="text-muted-foreground text-sm font-medium">Name</label>
          <div className="flex items-center gap-2">
            <p className="font-medium">{token.name}</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-muted-foreground text-sm font-medium">Token ID</label>
          <code className="bg-muted block rounded px-3 py-2 font-mono text-sm">
            {token.id}
          </code>
        </div>

        <div className="space-y-2">
          <label className="text-muted-foreground text-sm font-medium">
            Partial Token
          </label>
          <code className="bg-muted block rounded px-3 py-2 font-mono text-sm">
            {token.partialToken}
          </code>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-muted-foreground text-sm font-medium">Type</label>
            <div>
              <Badge variant={token.type === "inherit" ? "secondary" : "default"}>
                {token.type}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-muted-foreground text-sm font-medium">Status</label>
            <div>
              <Badge
                variant={token.isActive ? "default" : "destructive"}
                className={
                  token.isActive
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                }
              >
                {token.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-muted-foreground text-sm font-medium">User ID</label>
          <p className="font-mono text-sm">{token.userId}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-muted-foreground text-sm font-medium">Created</label>
            <p className="text-sm">
              {format(new Date(token.createdAt), "MMM dd, yyyy 'at' HH:mm")}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-muted-foreground text-sm font-medium">
              Last Updated
            </label>
            <p className="text-sm">
              {format(new Date(token.updatedAt), "MMM dd, yyyy 'at' HH:mm")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-muted-foreground text-sm font-medium">
              Last Used
            </label>
            <p className="text-sm">
              {token.lastUsed
                ? format(new Date(token.lastUsed), "MMM dd, yyyy 'at' HH:mm")
                : "Never"}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-muted-foreground text-sm font-medium">Expires</label>
            <p className="text-sm">
              {token.expires
                ? format(new Date(token.expires), "MMM dd, yyyy 'at' HH:mm")
                : "Never"}
            </p>
          </div>
        </div>

        {(token.permissionIds || token.permissions) && (
          <div className="space-y-2">
            <label className="text-muted-foreground text-sm font-medium">
              Permissions
            </label>
            <div className="flex flex-wrap gap-2">
              {(() => {
                const permissions = token.permissions || token.permissionIds

                if (Array.isArray(permissions)) {
                  return permissions.map((permission: any, index: number) => (
                    <Badge key={index} variant="outline">
                      {typeof permission === "object" && permission.name
                        ? permission.name
                        : permission}
                    </Badge>
                  ))
                }

                if (typeof permissions === "string") {
                  return <Badge variant="outline">{permissions}</Badge>
                }

                if (typeof permissions === "object" && permissions !== null) {
                  return <Badge variant="outline">{JSON.stringify(permissions)}</Badge>
                }

                return (
                  <span className="text-muted-foreground text-sm">
                    No specific permissions
                  </span>
                )
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="text-left">
            <DrawerTitle>Token Details</DrawerTitle>
          </DrawerHeader>
          <div className="overflow-y-auto px-4 pb-4">
            <TokenDetails />
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Token Details</DialogTitle>
        </DialogHeader>
        <TokenDetails />
      </DialogContent>
    </Dialog>
  )
}
