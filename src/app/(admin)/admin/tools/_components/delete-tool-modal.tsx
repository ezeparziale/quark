"use client"

import { useRouter } from "next/navigation"

import { useEffect, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import type { Tool } from "@prisma/client"
import { Loader2, Trash2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { deleteTool } from "@/actions/tools"

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

export default function DeleteToolModal({ tool }: { tool: Tool }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const formSchema = z.object({
    confirmString: z.literal(tool.name, {
      errorMap: () => ({ message: "Incorrect tool name" }),
    }),
  })

  type FormData = z.infer<typeof formSchema>

  const form = useForm<FormData>({
    defaultValues: { confirmString: "" },
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async () => {
    const result = await deleteTool(tool)
    if (result.success) {
      toast.success("Tool deleted successfully!", { duration: 4000 })
      router.push("/admin/tools")
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
              <span className="sr-only">delete tool</span>
              <span className="ml-2 hidden md:block">Delete tool</span>
            </Button>
          </ResponsiveDialogTrigger>
        </TooltipTrigger>
        <TooltipContent className="border-destructive md:hidden" align={"end"}>
          <p>Delete tool</p>
        </TooltipContent>
      </Tooltip>
      <ResponsiveDialogContent className="sm:max-w-[425px]">
        <ResponsiveDialogHeader className="text-left">
          <ResponsiveDialogTitle>Delete tool</ResponsiveDialogTitle>
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
                    Enter the tool name <b>{tool.name}</b> to continue.
                  </FormDescription>
                  <FormControl>
                    <Input
                      placeholder=""
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
                Delete tool
              </Button>
            </ResponsiveDialogFooter>
          </form>
        </Form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
