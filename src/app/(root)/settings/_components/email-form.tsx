"use client"

import { updateEmail } from "@/actions/users/update-email"
import { addServerErrors } from "@/lib/utils"
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
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  newEmail: z.string().email(),
})

type FormData = z.infer<typeof formSchema>

export default function EmailForm({ email }: { email: string }) {
  const form = useForm<FormData>({
    defaultValues: {
      newEmail: email,
    },
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    const result = await updateEmail(data)
    if (result.success) {
      form.reset({ newEmail: data.newEmail })
      toast("Please check your email to confirm your new email")
    } else {
      if (result.errors) {
        form.reset({ ...form.formState.defaultValues })
        addServerErrors(result.errors, form.setError)
      } else {
        toast.error("Something went wrong, Please try again.")
      }
    }
  }

  return (
    <div className="rounded-md border border-border p-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col space-y-4 md:w-2/3"
        >
          <FormField
            control={form.control}
            name="newEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder=""
                    {...field}
                    disabled={form.formState.isSubmitting}
                    autoComplete="email"
                  />
                </FormControl>
                <FormDescription>
                  We will email you to verify the change.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            size="sm"
            className="w-full md:w-1/5"
            disabled={form.formState.isSubmitting || !form.formState.isDirty}
            type="submit"
          >
            {form.formState.isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save
          </Button>
        </form>
      </Form>
    </div>
  )
}
