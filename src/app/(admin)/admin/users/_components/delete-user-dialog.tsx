import { useRouter } from "next/navigation"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { deleteUser } from "@/actions/users/delete-user"

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

export default function DeleteUserDialog({
  userId,
  userEmail,
  isOpen,
  setIsOpen,
}: {
  userId: number
  userEmail: string
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}) {
  // const { data: session } = useSession()
  const router = useRouter()
  // const buttonDisable = userEmail === session?.user.email

  const formSchema = z.object({
    confirmString: z.literal(userEmail, {
      errorMap: () => ({ message: "Incorrect user email" }),
    }),
  })

  type FormData = z.infer<typeof formSchema>

  const form = useForm<FormData>({
    defaultValues: { confirmString: "" },
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async () => {
    const result = await deleteUser(userId)
    if (result.success) {
      toast.success("User deleted successfully!")
      setIsOpen(false)
      router.push("/admin/users")
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
      <ResponsiveDialogContent className="sm:max-w-[425px]">
        <ResponsiveDialogHeader className="text-left">
          <ResponsiveDialogTitle>Delete user</ResponsiveDialogTitle>
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
                    Enter <b>{userEmail}</b> to continue.
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
                Delete
              </Button>
            </ResponsiveDialogFooter>
          </form>
        </Form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
