"use client"

import { updateUsername } from "@/actions/users/update-username"
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
  username: z.string().trim().min(1).max(60),
})

type FormData = z.infer<typeof formSchema>

export default function UsernameForm({ username }: { username: string }) {
  const form = useForm<FormData>({
    defaultValues: {
      username: username,
    },
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    const result = await updateUsername(data)
    if (result.success) {
      form.reset({ username: data.username })
    } else {
      if (result.errors) {
        addServerErrors(result.errors, form.setError)
      } else {
        toast.error("Something went wrong")
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
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder=""
                    {...field}
                    disabled={form.formState.isSubmitting}
                    autoComplete="username"
                  />
                </FormControl>
                <FormDescription>
                  This is your public display name. You can only change this once every
                  30 days.
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
