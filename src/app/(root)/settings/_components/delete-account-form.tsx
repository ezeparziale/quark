"use client"

import { useRouter } from "next/navigation"

import { useState } from "react"

import { deleteAccount } from "@/actions/users/delete-account"
import { addServerErrors } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

const formSchema = z.object({
  userEmail: z.string().email(),
  confirmString: z.literal("delete my account"),
})

type FormData = z.infer<typeof formSchema>

export default function DeleteAccount() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    const result = await deleteAccount(data)
    if (result.success) {
      router.push("/auth/logout")
    } else {
      if (result.errors) {
        addServerErrors(result.errors, form.setError)
      } else {
        toast.error("Something went wrong")
      }
    }
  }

  return (
    <>
      <div className="">
        <h3 className="text-md">Delete account</h3>
        <p className="pt-2 text-sm text-muted-foreground">
          Are your sure you wannt to delete your account?
        </p>
        <p className="text-sm text-muted-foreground">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              variant="destructive"
              className="mt-4 flex w-full flex-col md:w-auto"
              onClick={() => {
                form.reset({ ...form.formState.defaultValues }, { keepErrors: false })
              }}
              type="button"
            >
              Delete account
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Delete account</DialogTitle>
              <DialogDescription>
                Quark will delete all your data in the site.
              </DialogDescription>
            </DialogHeader>
            <Separator />
            <div className="flex flex-col items-start space-y-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex w-full flex-col space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="userEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormDescription>Please add your email</FormDescription>
                        <FormControl>
                          <Input
                            placeholder=""
                            {...field}
                            disabled={form.formState.isSubmitting}
                            autoComplete="email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmString"
                    render={({ field }) => (
                      <FormItem>
                        <FormDescription>
                          To verify, type <b>delete my account</b> below
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
                  <DialogFooter>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setIsOpen(false)
                      }}
                      type="button"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      disabled={form.formState.isSubmitting || !form.formState.isDirty}
                      type="submit"
                    >
                      {form.formState.isSubmitting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Delete account
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
