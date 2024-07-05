"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { zodResolver } from "@hookform/resolvers/zod"
import type { User } from "@prisma/client"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { addServerErrors } from "@/lib/utils"

import { userSchema } from "@/schemas/users"

import { addUser } from "@/actions/users/add-user"
import { updateUser } from "@/actions/users/update-user"

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
import { Switch } from "@/components/ui/switch"

type FormData = z.infer<typeof userSchema>

export default function UserForm({ user }: { user?: User }) {
  const router = useRouter()

  const form = useForm<FormData>({
    defaultValues: {
      id: user?.id || undefined,
      email: user?.email || "",
      username: user?.username || "",
      active: user?.active || false,
      confirmedEmail: user?.confirmedEmail || false,
    },
    resolver: zodResolver(userSchema),
  })

  const action = user ? "Update" : "Create"

  const onSubmitCreate = async (data: FormData) => {
    const result = await addUser(data)
    if (result.success) {
      router.push("/admin/users")
      toast.success("User created successfully!")
    } else {
      if (result.errors) {
        addServerErrors(result.errors, form.setError)
      } else if (result.message) {
        toast.error(result.message)
      } else {
        toast.error("Something went wrong")
      }
    }
  }

  const onSubmitUpdate = async (data: FormData) => {
    const result = await updateUser(data)
    if (result.success) {
      form.reset({ ...data })
      router.refresh()
      toast.success("User updated successfully!")
    } else {
      if (result.errors) {
        addServerErrors(result.errors, form.setError)
      } else if (result.message) {
        toast.error(result.message)
      } else {
        toast.error("Something went wrong")
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={
          action === "Create"
            ? form.handleSubmit(onSubmitCreate)
            : form.handleSubmit(onSubmitUpdate)
        }
        className="flex w-full flex-col space-y-4 md:w-2/3"
      >
        <FormField
          control={form.control}
          name="email"
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
              <FormDescription>Email user</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
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
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <h3 className="my-6 text-lg font-medium">Admin Actions</h3>
        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Active user</FormLabel>
                <FormDescription>
                  Enable this option if the user is currently active.
                </FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmedEmail"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Email Confirmed</FormLabel>
                <FormDescription>
                  Switch on to verify that the email address is confirmed.
                </FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
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
            <Loader2 className="mr-2 size-4 animate-spin" />
          )}
          {action}
        </Button>
        <Button size="sm" className="w-full md:w-1/5" variant="outline" asChild>
          <Link href="/admin/users/">Cancel</Link>
        </Button>
      </form>
    </Form>
  )
}
