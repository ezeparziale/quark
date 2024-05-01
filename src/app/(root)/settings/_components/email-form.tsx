"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { addServerErrors } from "@/lib/utils"

import { updateEmail } from "@/actions/users/update-email"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
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
      toast.info("Please check your email to confirm your new email")
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Email</CardTitle>
            <CardDescription>We will email you to verify the change.</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="newEmail"
              render={({ field }) => (
                <FormItem>
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
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button
              disabled={form.formState.isSubmitting || !form.formState.isDirty}
              type="submit"
            >
              {form.formState.isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
