import { useEffect } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { deleteToken } from "@/actions/tokens"

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
  const PHRASE_DELETE: string = "delete token"

  const formSchema = z.object({
    confirmString: z.literal(PHRASE_DELETE, {
      errorMap: () => ({ message: "Incorrect phrase. Please try again." }),
    }),
  })

  type FormData = z.infer<typeof formSchema>

  const form = useForm<FormData>({
    defaultValues: { confirmString: "" },
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async () => {
    const result = await deleteToken(tokenId)
    if (result.success) {
      toast.success("Token deleted successfully!", { duration: 4000 })
      setIsOpen(false)
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
      <ResponsiveDialogContent
        className="sm:max-w-[425px]"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <ResponsiveDialogHeader className="text-left">
          <ResponsiveDialogTitle>Confirm token deletion</ResponsiveDialogTitle>
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
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                Delete token
              </Button>
            </ResponsiveDialogFooter>
          </form>
        </Form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
