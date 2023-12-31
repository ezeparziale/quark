"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { createRole } from "@/actions/roles/create"
import { updateRole } from "@/actions/roles/update"
import { addServerErrors } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Role } from "@prisma/client"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1).max(45),
  description: z.string().min(1).max(255),
  key: z.string().min(1).max(255),
})

type FormData = z.infer<typeof formSchema>

export default function RoleForm({ role }: { role?: Role }) {
  const roleId = role?.id
  const router = useRouter()

  const form = useForm<FormData>({
    defaultValues: {
      id: role?.id || undefined,
      name: role?.name || "",
      description: role?.description || "",
      key: role?.key || "",
    },
    resolver: zodResolver(formSchema),
  })

  const action = role ? "Update" : "Create"

  const onSubmitCreate = async (data: FormData) => {
    const result = await createRole(data)
    if (result.success) {
      router.push("/admin/roles")
      router.refresh()
    } else {
      if (result.errors) {
        addServerErrors(result.errors, form.setError)
      } else {
        toast.error("Something went wrong")
      }
    }
  }

  const onSubmitEdit = async (data: FormData) => {
    const result = await updateRole({ id: Number(roleId), ...data })
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
            : form.handleSubmit(onSubmitEdit)
        }
        className="flex w-full flex-col space-y-8 md:w-2/3"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Read Access"
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
          name="key"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Key</FormLabel>
              <FormControl>
                <Input
                  placeholder="admin"
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. A user who is allowed to access all posts in viewer mode"
                  {...field}
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col space-y-4">
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
            <Link href="/admin/roles/">Cancel</Link>
          </Button>
        </div>
      </form>
    </Form>
  )
}
