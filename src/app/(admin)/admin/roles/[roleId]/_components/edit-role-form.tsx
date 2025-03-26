"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { zodResolver } from "@hookform/resolvers/zod"
import type { Role } from "@prisma/client"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { addServerErrors } from "@/lib/utils"

import { roleServerActionUpdateSchema } from "@/schemas/roles"

import { updateRole } from "@/actions/roles"

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
import { Textarea } from "@/components/ui/textarea"

type FormData = z.infer<typeof roleServerActionUpdateSchema>

export default function EditRoleForm({ role }: { role: Role }) {
  const router = useRouter()

  const form = useForm<FormData>({
    defaultValues: {
      id: role.id,
      name: role.name,
      description: role.description,
      key: role.key,
      isActive: role.isActive,
    },
    resolver: zodResolver(roleServerActionUpdateSchema),
    mode: "onChange",
  })

  const onSubmitUpdate = async (data: FormData) => {
    const result = await updateRole(data)
    if (result.success) {
      form.reset({ ...data })
      router.refresh()
      toast.success("Role updated successfully!")
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
                  placeholder="e.g. create_posts"
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
                <Textarea
                  placeholder="e.g. A user who is allowed to create and edit posts"
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
            {form.formState.isSubmitting && <Loader2 className="size-4 animate-spin" />}
            {form.formState.isSubmitting ? "Saving..." : "Save"}
          </Button>
          <Button size="sm" className="w-full md:w-1/5" variant="outline" asChild>
            <Link href="/admin/roles/">Cancel</Link>
          </Button>
        </div>
      </form>
    </Form>
  )
}
