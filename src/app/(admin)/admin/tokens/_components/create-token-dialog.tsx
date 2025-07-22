"use client"

import { useEffect, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown, Loader2, Search, X } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { createToken } from "@/actions/tokens"

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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { TokenDisplay } from "./token-display"

// Tipo para los permisos
type Permission = {
  id: number
  name: string
  description: string
  key: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

type User = {
  id: number
  email: string
  username: string
  isActive: boolean
  isAdmin: boolean
  emailVerified: boolean
  image: string | null
  createdAt: string
  updatedAt: string
}

interface CreateTokenDialogProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const fetchPermissions = async (query: string): Promise<Permission[]> => {
  try {
    const response = await fetch(
      `/api/v1/permissions?q=${encodeURIComponent(query)}&limit=20`,
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching permissions:", error)
    throw error
  }
}

const fetchUsers = async (query: string): Promise<User[]> => {
  try {
    const response = await fetch(
      `/api/v1/users?q=${encodeURIComponent(query)}&limit=20`,
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching users:", error)
    throw error
  }
}

const formSchema = z
  .object({
    name: z.string().min(1, {
      message: "Name is required.",
    }),
    userId: z.number({
      error: "You must select a user.",
    }),
    type: z.enum(["inherit", "custom"], {
      error: "You need to select a permission type.",
    }),
    permissionIds: z.array(z.number()).optional(),
  })
  .refine(
    (data) => {
      if (
        data.type === "custom" &&
        (!data.permissionIds || data.permissionIds.length === 0)
      ) {
        return false
      }
      return true
    },
    {
      message: "You must select at least one permission when using custom permissions.",
      path: ["permissionIds"],
    },
  )

export function CreateTokenDialog({ isOpen, setIsOpen }: CreateTokenDialogProps) {
  const [permissionsOpen, setPermissionsOpen] = useState(false)
  const [usersOpen, setUsersOpen] = useState(false)
  const [permissionsSearchQuery, setPermissionsSearchQuery] = useState("")
  const [usersSearchQuery, setUsersSearchQuery] = useState("")
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [permissionsLoading, setPermissionsLoading] = useState(false)
  const [usersLoading, setUsersLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generatedToken, setGeneratedToken] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      userId: undefined,
      type: "inherit",
      permissionIds: [],
    },
  })

  const watchType = form.watch("type")

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: "",
        userId: undefined,
        type: "inherit",
        permissionIds: [],
      })
      setSelectedPermissions([])
      setSelectedUser(null)
      setPermissionsSearchQuery("")
      setUsersSearchQuery("")
      setGeneratedToken(null)
    }
  }, [isOpen, form])

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

  useEffect(() => {
    if (!usersSearchQuery.trim()) {
      setUsers([])
      return
    }

    setUsersLoading(true)
    const timeoutId = setTimeout(async () => {
      try {
        const results = await fetchUsers(usersSearchQuery)
        setUsers(results)
      } catch (error) {
        console.error("Error fetching users:", error)
        setUsers([])
      } finally {
        setUsersLoading(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [usersSearchQuery])

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

  const handleSelectUser = (user: User) => {
    setSelectedUser(user)
    form.setValue("userId", user.id)
    setUsersOpen(false)
    setUsersSearchQuery("")
  }

  const getUserRole = (user: User) => {
    return user.isAdmin ? "Admin" : "User"
  }

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    try {
      const result = await createToken(data)

      if (result.success && result.data?.token) {
        setGeneratedToken(result.data.token)
        toast.success("Token created successfully!", { duration: 4000 })
      } else {
        toast.error("Something went wrong. Please try again.")
      }
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        {generatedToken ? (
          <TokenDisplay token={generatedToken} setIsOpen={setIsOpen} />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Create New Token</DialogTitle>
              <DialogDescription>
                Create a new access token with specific permissions for a user.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Name Field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter token name..." {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter a descriptive name for this token.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="userId"
                  render={() => (
                    <FormItem className="flex flex-col">
                      <FormLabel>User</FormLabel>
                      <Popover open={usersOpen} onOpenChange={setUsersOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={usersOpen}
                              className="justify-between bg-transparent"
                            >
                              <div className="flex items-center gap-2">
                                <Search className="h-4 w-4" />
                                {selectedUser
                                  ? selectedUser.username
                                  : "Select user..."}
                              </div>
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-[--radix-popover-trigger-width] p-0"
                          align="start"
                        >
                          <Command>
                            <CommandInput
                              placeholder="Search users..."
                              value={usersSearchQuery}
                              onValueChange={setUsersSearchQuery}
                              autoFocus
                            />
                            <CommandList>
                              {usersLoading && (
                                <CommandEmpty>Searching users...</CommandEmpty>
                              )}
                              {!usersLoading &&
                                usersSearchQuery &&
                                users.length === 0 && (
                                  <CommandEmpty>No users found.</CommandEmpty>
                                )}
                              {!usersLoading && !usersSearchQuery && (
                                <CommandEmpty>Type to search users.</CommandEmpty>
                              )}
                              {!usersLoading && users.length > 0 && (
                                <CommandGroup>
                                  {users.map((user) => (
                                    <CommandItem
                                      key={user.id}
                                      value={user.username}
                                      onSelect={() => handleSelectUser(user)}
                                    >
                                      <Check
                                        className={`mr-2 h-4 w-4 ${selectedUser?.id === user.id ? "opacity-100" : "opacity-0"}`}
                                      />
                                      <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                          <span className="font-medium">
                                            {user.username}
                                          </span>
                                          {user.isAdmin && (
                                            <Badge
                                              variant="secondary"
                                              className="text-xs"
                                            >
                                              Admin
                                            </Badge>
                                          )}
                                          {!user.isActive && (
                                            <Badge
                                              variant="destructive"
                                              className="text-xs"
                                            >
                                              Inactive
                                            </Badge>
                                          )}
                                        </div>
                                        <span className="text-muted-foreground text-sm">
                                          {user.email}
                                        </span>
                                        <div className="text-muted-foreground flex items-center gap-2 text-xs">
                                          <span>{getUserRole(user)}</span>
                                          {user.emailVerified && (
                                            <span>• Verified</span>
                                          )}
                                        </div>
                                      </div>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              )}
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormDescription>Select the user for this token.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Permission Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-2"
                        >
                          <FormItem className="flex items-center space-y-0 space-x-3">
                            <FormControl>
                              <RadioGroupItem value="inherit" />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="font-normal">
                                Inherit User Permissions
                              </FormLabel>
                              <p className="text-muted-foreground text-sm">
                                Token will have the same permissions as the selected
                                user
                              </p>
                            </div>
                          </FormItem>
                          <FormItem className="flex items-center space-y-0 space-x-3">
                            <FormControl>
                              <RadioGroupItem value="custom" />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="font-normal">
                                Custom Permissions
                              </FormLabel>
                              <p className="text-muted-foreground text-sm">
                                Select specific permissions for this token
                              </p>
                            </div>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchType === "custom" && (
                  <FormField
                    control={form.control}
                    name="permissionIds"
                    render={() => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Permissions</FormLabel>
                        <Popover
                          open={permissionsOpen}
                          onOpenChange={setPermissionsOpen}
                        >
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={permissionsOpen}
                                className="justify-between bg-transparent"
                              >
                                <div className="flex items-center gap-2">
                                  <Search className="h-4 w-4" />
                                  {selectedPermissions.length > 0
                                    ? `${selectedPermissions.length} permission${selectedPermissions.length === 1 ? "" : "s"} selected`
                                    : "Select permissions..."}
                                </div>
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent
                            className="w-[--radix-popover-trigger-width] p-0"
                            align="start"
                          >
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
                                  <CommandEmpty>
                                    Type to search permissions.
                                  </CommandEmpty>
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
                                          <Check
                                            className={`mr-2 h-4 w-4 ${isSelected ? "opacity-100" : "opacity-0"}`}
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
                          Select the permissions you want to assign.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {watchType === "custom" && selectedPermissions.length > 0 && (
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
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        <span>Creating...</span>
                      </>
                    ) : (
                      "Create Token"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
