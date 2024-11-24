"use client"

import { useEffect, useState } from "react"
import { Dispatch, SetStateAction } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { tokenCreateServerActionSchema } from "@/schemas/tokens"

import { createToken } from "@/actions/tokens"

import { Button } from "@/components/ui/button"
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
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

import { CopyButtonData } from "@/components/copy-clipboard-button"

type FormData = z.infer<typeof tokenCreateServerActionSchema>

type User = {
  id: string
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
            <span className="ml-2 hidden md:block">Create token</span>
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
        <CreateTokenForm setIsOpen={setIsOpen} setToken={setToken} token={token} />
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}

function CreateTokenForm({
  setIsOpen,
  token,
  setToken,
}: {
  setIsOpen: Dispatch<SetStateAction<boolean>>
  token: string | undefined
  setToken: Dispatch<SetStateAction<string | undefined>>
}) {
  const [users, setUsers] = useState<User[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)

  const form = useForm<FormData>({
    defaultValues: {
      name: "",
      userId: undefined,
    },
    resolver: zodResolver(tokenCreateServerActionSchema),
  })

  const onSubmitCreate = async (data: FormData) => {
    const result = await createToken(data)
    if (result.success) {
      toast.success("Token created successfully!")
      setToken(result.data?.token!)
    } else {
      toast.error("Something went wrong")
    }
  }

  const fetchUsers = async () => {
    const limit = 100
    let page = 1
    let allUsers: User[] = []
    let hasMore = true

    setIsLoadingUsers(true)

    try {
      while (hasMore) {
        const response = await fetch(`/api/v1/users?page=${page}&limit=${limit}`)

        if (!response.ok) {
          throw new Error("Failed to fetch users")
        }

        const fetchedUsers = await response.json()

        allUsers = [...allUsers, ...fetchedUsers]

        if (fetchedUsers.length < limit) {
          hasMore = false
        } else {
          page += 1
        }
      }

      setUsers(allUsers)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast.error("Failed to load users")
    } finally {
      setIsLoadingUsers(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <>
      {token ? (
        <TokenDisplay token={token} setIsOpen={setIsOpen} />
      ) : (
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
                  <FormItem>
                    <FormLabel>User</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a user" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingUsers ? (
                          <SelectItem key="loading" value="loading" disabled>
                            <div className="flex items-center">
                              <Loader2 className="mr-2 size-4 animate-spin" />
                              <span>Loading users...</span>
                            </div>
                          </SelectItem>
                        ) : (
                          users.map((user) => (
                            <SelectItem key={user.id} value={user.id.toString()}>
                              {user.email}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
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
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  )}
                  {form.formState.isSubmitting ? "Creating..." : "Create"}
                </Button>
              </ResponsiveDialogFooter>
            </form>
          </Form>
        </>
      )}
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
