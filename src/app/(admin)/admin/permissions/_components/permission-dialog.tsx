import { useEffect } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { Permission } from "@prisma/client"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { addServerErrors } from "@/lib/utils"

import { permissionSchema } from "@/schemas/permissions"

import { createPermission, updatePermission } from "@/actions/permissions"

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
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"

type FormData = z.infer<typeof permissionSchema>

export default function PermissionDialog({
  permission,
  isOpen,
  setIsOpen,
}: {
  permission?: Permission
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}) {
  const form = useForm<FormData>({
    defaultValues: {
      id: permission?.id || undefined,
      name: permission?.name || "",
      description: permission?.description || "",
      key: permission?.key || "",
    },
    resolver: zodResolver(permissionSchema),
  })

  const action = permission ? "Update" : "Create"
  const titles = {
    Create: "Create new permission",
    Update: "Update permission",
  }

  const descriptions = {
    Create: "Create a permission which can be assigned to your roles.",
    Update: "Modify the details of an existing permission.",
  }

  const title = titles[action]
  const description = descriptions[action]

  const onSubmitCreate = async (data: FormData) => {
    const result = await createPermission(data)
    if (result.success) {
      setIsOpen(false)
      toast.success("Permission created successfully!")
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

  const onSubmitUpdate = async (data: FormData) => {
    const result = await updatePermission(data)
    if (result.success) {
      form.reset({ ...data })
      setIsOpen(false)
      toast.success("Permission updated successfully!")
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
      <ResponsiveDialogContent className="sm:max-w-[525px]">
        <ResponsiveDialogHeader className="text-left">
          <ResponsiveDialogTitle>{title}</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>{description}</ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <Form {...form}>
          <form
            onSubmit={
              action === "Create"
                ? form.handleSubmit(onSubmitCreate)
                : form.handleSubmit(onSubmitUpdate)
            }
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
                      placeholder="e.g. Create posts"
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
                      placeholder="feature:action e.g. posts:create"
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
                      placeholder="e.g. A user who is allowed to create a post"
                      {...field}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
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
                {action} permission
              </Button>
            </ResponsiveDialogFooter>
          </form>
        </Form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
