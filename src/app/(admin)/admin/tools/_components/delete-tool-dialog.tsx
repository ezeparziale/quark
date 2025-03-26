import { useRouter } from "next/navigation"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

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
} from "@/components/ui/responsive-dialog"

export default function DeleteToolDialog({
  toolId,
  toolName,
  isOpen,
  setIsOpen,
}: {
  toolId: number
  toolName: string
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}) {
  const router = useRouter()

  const formSchema = z.object({
    confirmString: z.literal(toolName, {
      errorMap: () => ({ message: "Incorrect tool name" }),
    }),
  })

  type FormData = z.infer<typeof formSchema>

  const form = useForm<FormData>({
    defaultValues: { confirmString: "" },
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async () => {
    const result = await deleteTool(toolId)
    if (result.success) {
      toast.success("Tool deleted successfully!", { duration: 4000 })
      setIsOpen(false)
      router.push("/admin/tools")
    } else {
      toast.error(result.message)
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) form.reset()
  }

  return (
    <ResponsiveDialog open={isOpen} onOpenChange={handleOpenChange}>
      <ResponsiveDialogContent
        className="sm:max-w-[425px]"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <ResponsiveDialogHeader className="text-left">
          <ResponsiveDialogTitle>Delete tool?</ResponsiveDialogTitle>
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
                    Enter the tool name <b>{toolName}</b> to continue.
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
                  <Loader2 className="size-4 animate-spin" />
                )}
                Delete
              </Button>
            </ResponsiveDialogFooter>
          </form>
        </Form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
