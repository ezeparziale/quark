import Link from "next/link"

import { useEffect } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { Tool } from "@prisma/client"
import { ExternalLink, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { addServerErrors } from "@/lib/utils"

import { toolSchema } from "@/schemas/tools"

import { createTool, updateTool } from "@/actions/tools"

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
import {
  ResponsiveDialog,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog"

type FormData = z.infer<typeof toolSchema>

export default function ToolDialog({
  tool,
  isOpen,
  setIsOpen,
}: {
  tool?: Tool
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}) {
  const form = useForm<FormData>({
    defaultValues: {
      id: tool?.id || undefined,
      name: tool?.name || "",
      description: tool?.description || "",
      href: tool?.href || "",
      icon: tool?.icon || "",
    },
    resolver: zodResolver(toolSchema),
  })

  const action = tool ? "Update" : "Create"
  const titles = {
    Create: "Create new tool",
    Update: "Update tool",
  }

  const descriptions = {
    Create: "Create a tool which can be assigned to your roles.",
    Update: "Modify the details of an existing tool.",
  }

  const title = titles[action]
  const description = descriptions[action]

  const onSubmitCreate = async (data: FormData) => {
    const result = await createTool(data)
    if (result.success) {
      setIsOpen(false)
      toast.success("Tool created successfully!")
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
    const result = await updateTool(data)
    if (result.success) {
      form.reset({ ...data })
      setIsOpen(false)
      toast.success("Tool updated successfully!")
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
                      placeholder="e.g. Blog"
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
                      placeholder="e.g. Blog app for shared posts"
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
              name="href"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Href</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. /tools/blog"
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
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. notebook-pen"
                      {...field}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    <div className="flex items-center gap-1">
                      <span>Check names in </span>{" "}
                      <Link
                        href="https://lucide.dev/icons/"
                        target="_blank"
                        className="underline"
                      >
                        <div className="flex items-center gap-1">
                          <span>Lucide icons</span>
                          <ExternalLink className="size-4" />
                        </div>
                      </Link>
                    </div>
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
                  <Loader2 className="size-4 animate-spin" />
                )}
                {action} tool
              </Button>
            </ResponsiveDialogFooter>
          </form>
        </Form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
