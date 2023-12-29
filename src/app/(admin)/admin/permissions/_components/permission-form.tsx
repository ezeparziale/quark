"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { createPermission } from "@/actions/permissions/create"
import { updatePermission } from "@/actions/permissions/update"
import { addServerErrors } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Permission } from "@prisma/client"
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
  id: z.number().optional(),
  name: z.string().trim().min(1).max(45),
  description: z.string().trim().min(1).max(255),
  key: z
    .string()
    .trim()
    .refine((data) => /^[a-zA-Z0-9_]+:[a-zA-Z0-9_]+$/.test(data), {
      message: "The permission must follow the format 'feature:permission'",
    })
    .refine((data) => data.length <= 255, {
      message: "String must contain at most 255 character(s)",
    }),
})

type FormData = z.infer<typeof formSchema>

export default function PermissionForm({ permission }: { permission?: Permission }) {
  const permissionId = permission?.id

  const router = useRouter()

  const form = useForm<FormData>({
    defaultValues: {
      id: permission?.id || undefined,
      name: permission?.name || "",
      description: permission?.description || "",
      key: permission?.key || "",
    },
    resolver: zodResolver(formSchema),
  })

  const action = permission ? "Update" : "Create"

  const onSubmitCreate = async (data: FormData) => {
    const result = await createPermission(data)
    if (result.success) {
      router.push("/admin/permissions")
      toast.success("Permission created successfully!")
    } else {
      if (result.errors) {
        addServerErrors(result.errors, form.setError)
      } else {
        toast.error("Something went wrong")
      }
    }
  }

  const onSubmitEdit = async (data: FormData) => {
    const result = await updatePermission({ id: Number(permissionId), ...data })
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
                  placeholder="e.g. Create posts"
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
                  placeholder="feature:permission"
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
                  placeholder="e.g. A user who is allowed to create a post"
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
            <Link href="/admin/permissions/">Cancel</Link>
          </Button>
        </div>
      </form>
    </Form>
  )
}
