"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { addUser } from "@/actions/users/add-user"
import { updateUser } from "@/actions/users/update-user"
import { addServerErrors } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import type { User } from "@prisma/client"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
  id: z.string().optional(),
  email: z.string().email(),
  username: z.string().trim(),
  active: z.boolean().default(false),
  confirmedEmail: z.boolean().default(false),
})

type FormData = z.infer<typeof formSchema>

export default function CreateUserForm({ user }: { user?: User }) {
  const userId = user?.id

  const router = useRouter()

  const form = useForm<FormData>({
    defaultValues: {
      id: user?.id || undefined,
      email: user?.email || "",
      username: user?.username || "",
      active: user?.active || false,
      confirmedEmail: user?.confirmedEmail || false,
    },
    resolver: zodResolver(formSchema),
  })

  const action = user ? "Update" : "Create"

  const onSubmitCreate = async (data: FormData) => {
    const result = await addUser(data)
    if (result.success) {
      router.push("/admin/users")
    } else {
      if (result.errors) {
        addServerErrors(result.errors, form.setError)
      } else {
        toast.error("Something went wrong")
      }
    }
  }

  const onSubmitUpdate = async (data: FormData) => {
    const result = await updateUser({ id: String(userId), ...data })
    if (result.success) {
      form.reset({ ...data })
      router.refresh()
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
        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md py-1">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Active user</FormLabel>
                <FormDescription>Check if user is active</FormDescription>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmedEmail"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md py-1">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Email Confirmed</FormLabel>
                <FormDescription>
                  Check this box if email address is confirmed
                </FormDescription>
              </div>
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
          {action}
        </Button>
        <Button size="sm" className="w-full md:w-1/5" variant="outline" asChild>
          <Link href="/admin/users/">Cancel</Link>
        </Button>
      </form>
    </Form>
  )
}
