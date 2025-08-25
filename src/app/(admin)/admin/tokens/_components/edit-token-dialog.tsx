import { useEffect, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { CheckIcon, ChevronsUpDownIcon, Loader2, Search, X } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { tokenUpdateSchema } from "@/schemas/tokens"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import { Switch } from "@/components/ui/switch"

type FormData = z.infer<typeof tokenUpdateSchema>

type Permission = {
  id: number
  name: string
  description: string
  key: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

type Token = {
  id: string
  name: string
  partialToken: string
  userId: number
  type: "inherit" | "custom" | undefined
  isActive: boolean
  user: {
    id: number
    username: string
  }
  permissions: { id: number; name: string }[]
  permissionIds: number[]
}

export default function EditTokenDialog({
  token,
  isOpen,
  setIsOpen,
}: {
  token: Token
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}) {
  const [permissionsOpen, setPermissionsOpen] = useState(false)
  const [permissionsSearchQuery, setPermissionsSearchQuery] = useState("")
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([])
  const [permissionsLoading, setPermissionsLoading] = useState(false)

  const form = useForm<FormData>({
    defaultValues: {
      name: token.name,
      isActive: token.isActive,
      permissionIds: token.permissionIds,
      type: token.type,
    },
    resolver: zodResolver(tokenUpdateSchema),
  })

  useEffect(() => {
    if (isOpen && token) {
      form.reset({
        name: token.name,
        isActive: token.isActive,
        permissionIds: token.permissions.map((p) => p.id),
        type: token.type,
      })

      if (token.type === "custom" && token.permissions.length > 0) {
        const selectedPermissionsFromToken: Permission[] = token.permissions.map(
          (p) => ({
            id: p.id,
            name: p.name,
            description: `Description for permission ${p.name}`,
            key: `permission:${p.id}`,
            isActive: true,
            createdAt: "2025-01-22T10:30:00.000Z",
            updatedAt: "2025-01-22T10:30:00.000Z",
          }),
        )
        setSelectedPermissions(selectedPermissionsFromToken)
      } else {
        setSelectedPermissions([])
      }

      setPermissionsSearchQuery("")
    }
  }, [isOpen, token, form])

  useEffect(() => {
    if (!permissionsSearchQuery.trim()) {
      setPermissions([])
      return
    }

    setPermissionsLoading(true)
    const timeoutId = setTimeout(async () => {
      try {
        const results = await fetchPermissions(permissionsSearchQuery)
        setPermissions(results)
      } catch (error) {
        console.error("Error fetching permissions:", error)
        setPermissions([])
      } finally {
        setPermissionsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [permissionsSearchQuery])

  const handleSelectPermission = (permission: Permission) => {
    const isAlreadySelected = selectedPermissions.some((p) => p.id === permission.id)
    if (!isAlreadySelected) {
      const newSelected = [...selectedPermissions, permission]
      setSelectedPermissions(newSelected)
      form.setValue(
        "permissionIds",
        newSelected.map((p) => p.id),
      )
    }
  }

  const removePermission = (permissionId: number) => {
    const newSelected = selectedPermissions.filter((p) => p.id !== permissionId)
    setSelectedPermissions(newSelected)
    form.setValue(
      "permissionIds",
      newSelected.map((p) => p.id),
    )
  }

  const fetchPermissions = async (query: string): Promise<Permission[]> => {
    try {
      const response = await fetch(
        `/api/v1/permissions?q=${encodeURIComponent(query)}&limit=20`,
      )
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      return await response.json()
    } catch (error) {
      console.error("Error fetching permissions:", error)
      return []
    }
  }

  const onSubmit = async (data: FormData) => {
    console.log("Updating token...")
    if (!token) return

    try {
      const response = await fetch(`/api/v1/tokens/${token.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if (response.ok) {
        toast.success("Token edited successfully!", { duration: 4000 })
        setIsOpen(false)
      } else {
        const errorData = await response.json()
        toast.error(errorData.message)
      }
    } catch (error) {
      console.error("❌ Error updating token:", error)
      toast.error("Failed to update token")
    }
  }

  const handleCancel = () => {
    setIsOpen(false)
    form.reset()
    setSelectedPermissions([])
    setPermissionsSearchQuery("")
  }

  return (
    <ResponsiveDialog open={isOpen} onOpenChange={setIsOpen}>
      <ResponsiveDialogContent
        className="sm:max-w-[425px]"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <ResponsiveDialogHeader className="text-left">
          <ResponsiveDialogTitle>Edit token</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Modify the details of an existing token.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-4 px-4 sm:px-0"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={form.formState.isSubmitting}
                      autoComplete="no"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="base">Active</FormLabel>
                    <FormDescription>Enable or disable the token.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="bg-muted/50 rounded-lg border p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Token:</span>
                  <code className="bg-background rounded px-2 py-1 font-mono text-sm">
                    {token.partialToken}
                  </code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">User:</span>
                  <span className="text-sm">{token.user.username}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Type:</span>
                  <Badge variant={token.type === "custom" ? "default" : "secondary"}>
                    {token.type === "custom" ? "Custom" : "Inherit"}
                  </Badge>
                </div>
              </div>
            </div>
            {token.type === "custom" && (
              <>
                <FormField
                  control={form.control}
                  name="permissionIds"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Permissions</FormLabel>
                      <Popover open={permissionsOpen} onOpenChange={setPermissionsOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={permissionsOpen}
                              className="justify-between bg-transparent"
                            >
                              <div className="flex items-center gap-2">
                                <Search className="size-4" />
                                {selectedPermissions.length > 0
                                  ? `${selectedPermissions.length} permission${selectedPermissions.length === 1 ? "" : "s"} selected`
                                  : "Select permissions..."}
                              </div>
                              <ChevronsUpDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search permissions..."
                              value={permissionsSearchQuery}
                              onValueChange={setPermissionsSearchQuery}
                              autoFocus
                            />
                            <CommandList>
                              {permissionsLoading && (
                                <CommandEmpty>Searching permissions...</CommandEmpty>
                              )}
                              {!permissionsLoading &&
                                permissionsSearchQuery &&
                                permissions.length === 0 && (
                                  <CommandEmpty>No permissions found.</CommandEmpty>
                                )}
                              {!permissionsLoading && !permissionsSearchQuery && (
                                <CommandEmpty>Type to search permissions.</CommandEmpty>
                              )}
                              {!permissionsLoading && permissions.length > 0 && (
                                <CommandGroup>
                                  {permissions.map((permission) => {
                                    const isSelected = selectedPermissions.some(
                                      (p) => p.id === permission.id,
                                    )
                                    return (
                                      <CommandItem
                                        key={permission.id}
                                        value={permission.name}
                                        onSelect={() =>
                                          handleSelectPermission(permission)
                                        }
                                        disabled={isSelected}
                                      >
                                        <CheckIcon
                                          className={`mr-2 size-4 ${isSelected ? "opacity-100" : "opacity-0"}`}
                                        />
                                        <div className="flex flex-col">
                                          <span className="font-medium">
                                            {permission.name}
                                          </span>
                                          <span className="text-muted-foreground text-sm">
                                            {permission.description}
                                          </span>
                                          <span className="text-muted-foreground text-xs">
                                            {permission.key}
                                          </span>
                                        </div>
                                      </CommandItem>
                                    )
                                  })}
                                </CommandGroup>
                              )}
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Select the permissions you want to assign to this token.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {selectedPermissions.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Selected permissions:</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedPermissions.map((permission) => (
                        <Badge
                          key={permission.id}
                          variant="secondary"
                          className="flex items-center gap-1 pr-1"
                        >
                          <span className="text-xs">{permission.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="hover:bg-destructive hover:text-destructive-foreground h-4 w-4 p-0"
                            onClick={() => removePermission(permission.id)}
                          >
                            <X className="size-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
            <ResponsiveDialogFooter className="flex flex-col-reverse px-0 pt-0 sm:flex-row">
              <ResponsiveDialogClose asChild>
                <Button variant="outline" type="button" onClick={handleCancel}>
                  Cancel
                </Button>
              </ResponsiveDialogClose>
              <Button
                variant="destructive"
                disabled={form.formState.isSubmitting || !form.formState.isDirty}
                type="submit"
              >
                {form.formState.isSubmitting && (
                  <Loader2 className="size-4 animate-spin" />
                )}
                {form.formState.isSubmitting ? "Saving..." : "Save"}
              </Button>
            </ResponsiveDialogFooter>
          </form>
        </Form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
