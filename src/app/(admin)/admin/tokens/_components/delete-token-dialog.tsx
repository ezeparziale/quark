import { useRouter } from "next/navigation"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

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

export default function DeleteTokenDialog({
  tokenId,
  tokenName,
  isOpen,
  setIsOpen,
}: {
  tokenId: string
  tokenName: string
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}) {
  const router = useRouter()

  const PHRASE_DELETE: string = "delete token"

  const formSchema = z.object({
    confirmString: z.literal(PHRASE_DELETE, {
      error: "Incorrect phrase. Please try again.",
    }),
  })

  type FormData = z.infer<typeof formSchema>

  const form = useForm<FormData>({
    defaultValues: { confirmString: "" },
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async () => {
    try {
      const response = await fetch(`/api/v1/tokens/${tokenId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Token deleted successfully!", { duration: 4000 })
        setIsOpen(false)
        router.refresh()
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || "Something went wrong")
      }
    } catch {
      toast.error("Something went wrong")
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
          <ResponsiveDialogTitle>Delete token?</ResponsiveDialogTitle>
          <ResponsiveDialogDescription>
            This action is permanent and may result in users losing access to the API.
            <br />
            <br />
            Name: {tokenName}
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
                    Enter the phrase <b>{PHRASE_DELETE}</b> to continue.
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
                {form.formState.isSubmitting ? "Deleting..." : "Delete"}
              </Button>
            </ResponsiveDialogFooter>
          </form>
        </Form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
