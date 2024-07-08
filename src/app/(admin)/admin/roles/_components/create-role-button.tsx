"use client"

import { useEffect, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { addServerErrors } from "@/lib/utils"

import { rolesCreateSchema } from "@/schemas/roles"

import { createRole } from "@/actions/roles"

import { Button } from "@/components/ui/button"
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
import MultipleSelector, { type Option } from "@/components/ui/multiple-selector"
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/ui/responsive-dialog"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

type FormData = z.infer<typeof rolesCreateSchema>

const searchPermissions = async (search: string): Promise<Option[]> => {
  const res = await fetch(`/api/permissions/options/?search=${search}`)
  const data: Option[] = await res.json()
  return data
}

export default function CreateRoleButton() {
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<FormData>({
    defaultValues: {
      name: "",
      description: "",
      key: "",
      permissions: undefined,
    },
    resolver: zodResolver(rolesCreateSchema),
  })

  const onSubmitCreate = async (data: FormData) => {
    const result = await createRole(data)
    if (result.success) {
      setIsOpen(false)
      form.reset()
      toast.success("Role created successfully!")
    } else {
      if (result.errors) {
        addServerErrors(result.errors, form.setError)
      } else if (result.message) {
        toast.error(result.message)
      } else {
        toast.error("Something went wrong")
      }
    }
  }

  useEffect(() => {
    if (isOpen === false) {
      form.reset()
    }
  }, [isOpen, form])

  return (
    <ResponsiveDialog open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <ResponsiveDialogTrigger asChild>
            <Button>
              <Plus className="size-4" />
              <span className="sr-only">create role</span>
              <span className="ml-2 hidden md:block">Create role</span>
            </Button>
          </ResponsiveDialogTrigger>
        </TooltipTrigger>
        <TooltipContent className="md:hidden" align={"end"}>
          <p>Create role</p>
        </TooltipContent>
      </Tooltip>
      <ResponsiveDialogContent className="sm:max-w-[525px]">
        <ResponsiveDialogHeader className="text-left">
          <ResponsiveDialogTitle>Create new role</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            Create a role which can be assigned to your users.
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
                      placeholder="e.g. Read Access"
                      {...field}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. admin"
                      {...field}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. A user who is allowed to access all posts in viewer mode"
                      {...field}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="permissions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Permissions</FormLabel>
                  <FormControl>
                    <MultipleSelector
                      {...field}
                      onSearch={async (search) => {
                        const res = await searchPermissions(search)
                        return res
                      }}
                      triggerSearchOnFocus
                      placeholder="Search permissions..."
                      loadingIndicator={
                        <p className="py-2 text-center text-lg leading-10 text-muted-foreground">
                          Loading...
                        </p>
                      }
                      emptyIndicator={
                        <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                          No results found.
                        </p>
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Select all the permissions for this role.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <ResponsiveDialogFooter className="flex flex-col-reverse px-0 pt-0 sm:flex-row">
              <ResponsiveDialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </ResponsiveDialogClose>
              <Button
                disabled={form.formState.isSubmitting || !form.formState.isDirty}
                type="submit"
              >
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                Create role
              </Button>
            </ResponsiveDialogFooter>
          </form>
        </Form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
