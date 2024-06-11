"use client"

import { useRouter } from "next/navigation"

import { useEffect, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import type { Permission } from "@prisma/client"
import { Loader2, Trash2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { deletePermission } from "@/actions/permissions"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
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
  ResponsiveDialogTrigger,
} from "@/components/ui/responsive-dialog"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export default function DeletePermissionModal({
  permission,
}: {
  permission: Permission
}) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const formSchema = z.object({
    confirmString: z.literal(permission.key, {
      errorMap: () => ({ message: "Incorrect permission key" }),
    }),
  })

  type FormData = z.infer<typeof formSchema>

  const form = useForm<FormData>({
    defaultValues: { confirmString: "" },
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async () => {
    const result = await deletePermission(permission)
    if (result.success) {
      toast.success("Permission deleted successfully!", { duration: 4000 })
      router.push("/admin/permissions")
    } else {
      toast.error(result.message)
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
            <Button variant="destructive">
              <Trash2 className="size-4" />
              <span className="sr-only">delete permission</span>
              <span className="ml-2 hidden md:block">Delete permission</span>
            </Button>
          </ResponsiveDialogTrigger>
        </TooltipTrigger>
        <TooltipContent className="border-destructive md:hidden" align={"end"}>
          <p>Delete permission</p>
        </TooltipContent>
      </Tooltip>
      <ResponsiveDialogContent
        className="sm:max-w-[425px]"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <ResponsiveDialogHeader className="text-left">
          <ResponsiveDialogTitle>Delete permission</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            This action is permanent and could result in users losing access to your
            application.
          </ResponsiveDialogDescription>
        </ResponsiveDialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-4 px-4 sm:px-0"
          >
            <FormField
              control={form.control}
              name="confirmString"
              render={({ field }) => (
                <FormItem>
                  <FormDescription>
                    Enter the permission key <b>{permission.key}</b> to continue.
                  </FormDescription>
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
            <ResponsiveDialogFooter className="flex flex-col-reverse px-0 pt-0 sm:flex-row">
              <ResponsiveDialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </ResponsiveDialogClose>
              <Button
                variant="destructive"
                disabled={form.formState.isSubmitting || !form.formState.isDirty}
                type="submit"
              >
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                Delete permission
              </Button>
            </ResponsiveDialogFooter>
          </form>
        </Form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
