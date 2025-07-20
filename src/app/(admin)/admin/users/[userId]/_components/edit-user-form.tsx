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

import { userEditServerActionSchema } from "@/schemas/users"

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

type FormData = z.infer<typeof userEditServerActionSchema>

export default function EditUserForm({ user }: { user: User }) {
  const router = useRouter()

  const form = useForm<FormData>({
    defaultValues: {
      id: user.id,
      email: user.email,
      username: user.username,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
      isAdmin: user.isAdmin,
    },
    resolver: zodResolver(userEditServerActionSchema),
    mode: "onChange",
  })

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
        onSubmit={form.handleSubmit(onSubmitUpdate)}
        className="flex w-full flex-col space-y-4 md:w-2/3"
      >
        <div className="flex items-start gap-x-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@example.com"
                    {...field}
                    disabled={form.formState.isSubmitting}
                    autoComplete="email"
                  />
                </FormControl>
                <FormDescription>User&apos;s email address</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Active</FormLabel>
                <FormControl>
                  <div className="flex h-10 items-center">
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={form.formState.isSubmitting}
                      aria-label="User active status"
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  placeholder="johndoe"
                  {...field}
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="emailVerified"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Email verified</FormLabel>
                <FormDescription>
                  Has the user verified their email address?
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={form.formState.isSubmitting}
                  aria-label="Email verified status"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isAdmin"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Admin User</FormLabel>
                <FormDescription>Grant admin privileges to this user</FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={form.formState.isSubmitting}
                  aria-label="Admin user status"
                />
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
          {form.formState.isSubmitting && <Loader2 className="size-4 animate-spin" />}
          {form.formState.isSubmitting ? "Saving..." : "Save"}
        </Button>
        <Button size="sm" className="w-full md:w-1/5" variant="outline" asChild>
          <Link href="/admin/users/">Cancel</Link>
        </Button>
      </form>
    </Form>
  )
}
