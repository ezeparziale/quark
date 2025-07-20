"use client"

import { useEffect, useState } from "react"
import { Dispatch, SetStateAction } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown, Loader2, Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { cn } from "@/lib/utils"

import { tokenCreateServerActionSchema } from "@/schemas/tokens"

import { createToken } from "@/actions/tokens"

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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

import { CopyButtonData } from "@/components/copy-clipboard-button"

type FormData = z.infer<typeof tokenCreateServerActionSchema>

type User = {
  id: number
  email: string
}

export default function CreateTokenButton() {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [token, setToken] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (isOpen === false) {
      setToken(undefined)
    }
  }, [isOpen])

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button onClick={() => setIsOpen(true)}>
            <Plus className="size-4" />
            <span className="sr-only">create token</span>
            <span className="hidden md:block">Create token</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="md:hidden" align={"end"}>
          <p>Create token</p>
        </TooltipContent>
      </Tooltip>
      <CreateTokenDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        token={token}
        setToken={setToken}
      />
    </>
  )
}

function CreateTokenDialog({
  isOpen,
  setIsOpen,
  token,
  setToken,
}: {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  token: string | undefined
  setToken: Dispatch<SetStateAction<string | undefined>>
}) {
  return (
    <ResponsiveDialog open={isOpen} onOpenChange={setIsOpen}>
      <ResponsiveDialogContent
        className="sm:max-w-[425px]"
        onCloseAutoFocus={(e) => e.preventDefault()}
        onEscapeKeyDown={token ? (e) => e.preventDefault() : undefined}
        onPointerDownOutside={token ? (e) => e.preventDefault() : undefined}
        onPointerDown={token ? (e) => e.preventDefault() : undefined}
        onInteractOutside={token ? (e) => e.preventDefault() : undefined}
      >
        {token ? (
          <TokenDisplay token={token} setIsOpen={setIsOpen} />
        ) : (
          <CreateTokenForm setIsOpen={setIsOpen} setToken={setToken} />
        )}
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}

function CreateTokenForm({
  setIsOpen,
  setToken,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>
  setToken: Dispatch<SetStateAction<string | undefined>>
}) {
  const [users, setUsers] = useState<User[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [isUserPopoverOpen, setIsUserPopoverOpen] = useState(false)
  const [selectedUserEmail, setSelectedUserEmail] = useState("")

  const form = useForm<FormData>({
    defaultValues: {
      name: "",
      userId: undefined,
    },
    resolver: zodResolver(tokenCreateServerActionSchema),
  })

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)

    return () => {
      clearTimeout(handler)
    }
  }, [search])

  const onSubmitCreate = async (data: FormData) => {
    const result = await createToken(data)
    if (result.success) {
      toast.success("Token created successfully!")
      setToken(result.data?.token!)
    } else {
      toast.error("Something went wrong")
    }
  }

  const fetchUsers = async (query: string) => {
    setIsLoadingUsers(true)
    try {
      const response = await fetch(`/api/v1/users?q=${query}&limit=5`)
      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }
      const fetchedUsers = await response.json()
      setUsers(fetchedUsers)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("Failed to load users")
    } finally {
      setIsLoadingUsers(false)
    }
  }

  useEffect(() => {
    if (debouncedSearch) {
      fetchUsers(debouncedSearch)
    } else {
      setUsers([])
    }
  }, [debouncedSearch])

  return (
    <>
      <ResponsiveDialogHeader className="text-left">
        <ResponsiveDialogTitle>Create token</ResponsiveDialogTitle>
        <ResponsiveDialogDescription>
          Create a token access to the API.
        </ResponsiveDialogDescription>
      </ResponsiveDialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmitCreate)}
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
                    placeholder=""
                    autoComplete="no"
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>User</FormLabel>
                <Popover open={isUserPopoverOpen} onOpenChange={setIsUserPopoverOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {selectedUserEmail || "Select user"}
                        <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[365px] p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search user by email..."
                        onValueChange={setSearch}
                        value={search}
                      />
                      <CommandList>
                        {isLoadingUsers ? (
                          <div className="py-6 text-center text-sm">
                            <span>Loading...</span>
                          </div>
                        ) : (
                          <>
                            {debouncedSearch && users.length === 0 && (
                              <CommandEmpty>No user found.</CommandEmpty>
                            )}
                            <CommandGroup>
                              {users.map((user) => (
                                <CommandItem
                                  value={user.email}
                                  key={user.id}
                                  onSelect={() => {
                                    form.setValue("userId", user.id)
                                    setSelectedUserEmail(user.email)
                                    setIsUserPopoverOpen(false)
                                    setUsers([])
                                    setSearch("")
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 size-4",
                                      user.id === field.value
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />
                                  {user.email}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </>
                        )}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <ResponsiveDialogFooter className="flex flex-col-reverse px-0 pt-0 sm:flex-row">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setIsOpen(false)
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={form.formState.isSubmitting || !form.formState.isDirty}
              type="submit"
            >
              {form.formState.isSubmitting && (
                <Loader2 className="size-4 animate-spin" />
              )}
              {form.formState.isSubmitting ? "Creating..." : "Create"}
            </Button>
          </ResponsiveDialogFooter>
        </form>
      </Form>
    </>
  )
}

function TokenDisplay({
  token,
  setIsOpen,
}: {
  token: string
  setIsOpen: Dispatch<SetStateAction<boolean>>
}) {
  return (
    <>
      <ResponsiveDialogHeader className="text-left">
        <ResponsiveDialogTitle>Token generated successfully</ResponsiveDialogTitle>
        <ResponsiveDialogDescription>
          Please save this token now.
          <br />
          You won&apos;t be able to view it again.
        </ResponsiveDialogDescription>
      </ResponsiveDialogHeader>
      <div className="flex items-center space-x-2 px-4 sm:px-0">
        <div className="grid flex-1 gap-2">
          <Label htmlFor="token" className="sr-only">
            Token
          </Label>
          <Input id="token" defaultValue={token} readOnly />
        </div>
        <CopyButtonData
          textToCopy={token}
          successMessage="Token copied to clipboard!"
          label="Copy token"
        />
      </div>
      <ResponsiveDialogFooter>
        <ResponsiveDialogClose asChild>
          <Button type="button" onClick={() => setIsOpen(false)}>
            Finish
          </Button>
        </ResponsiveDialogClose>
      </ResponsiveDialogFooter>
    </>
  )
}
