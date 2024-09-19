"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { zodResolver } from "@hookform/resolvers/zod"
import type { Permission } from "@prisma/client"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { addServerErrors } from "@/lib/utils"

import { permissionServerActionSchema } from "@/schemas/permissions"

import { updatePermission } from "@/actions/permissions"

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
import { Switch } from "@/components/ui/switch"

type FormData = z.infer<typeof permissionServerActionSchema>

export default function EditPermissionForm({ permission }: { permission: Permission }) {
  const router = useRouter()

  const form = useForm<FormData>({
    defaultValues: {
      id: permission.id,
      name: permission.name,
      description: permission.description,
      key: permission.key,
      isActive: permission.isActive,
    },
    resolver: zodResolver(permissionServerActionSchema),
  })

  const onSubmitUpdate = async (data: FormData) => {
    const result = await updatePermission(data)
    if (result.success) {
      form.reset({ ...data })
      router.refresh()
      toast.success("Permission updated successfully!")
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
        className="flex w-full flex-col space-y-8 md:w-2/3"
      >
        <div className="flex gap-x-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex-1">
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
                    />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="key"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Key</FormLabel>
              <FormControl>
                <Input
                  placeholder="feature:action e.g. posts:create"
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
              <Loader2 className="mr-2 size-4 animate-spin" />
            )}
            Save
          </Button>
          <Button size="sm" className="w-full md:w-1/5" variant="outline" asChild>
            <Link href="/admin/permissions/">Cancel</Link>
          </Button>
        </div>
      </form>
    </Form>
  )
}
