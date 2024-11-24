"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { addServerErrors } from "@/lib/utils"

import { updateUsername } from "@/actions/users/update-username"

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
      toast.success("Username update succesfully!")
    } else {
      if (result.errors) {
        addServerErrors(result.errors, form.setError)
      } else {
        toast.error("Something went wrong")
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Username</CardTitle>
            <CardDescription>
              This is your public display name. You can only change this once every 30
              days.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder=""
                      {...field}
                      disabled={form.formState.isSubmitting}
                      autoComplete="username"
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
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}
              Save
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
