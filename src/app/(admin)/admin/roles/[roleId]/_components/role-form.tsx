"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { createRole } from "@/actions/roles/create"
import { editRole } from "@/actions/roles/edit"
import { addServerErrors } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Role } from "@prisma/client"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
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
import { toast } from "@/components/ui/use-toast"

const formSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1).max(255),
  description: z.string().min(1).max(255),
})

type FormData = z.infer<typeof formSchema>

export default function RoleForm({ role }: { role: Role | null }) {
  const roleId = role?.id
  const router = useRouter()

  const form = useForm<FormData>({
    defaultValues: {
      id: role?.id || undefined,
      name: role?.name || "",
      description: role?.description || "",
    },
    resolver: zodResolver(formSchema),
  })

  const action = role ? "Edit" : "Create"

  const onSubmitCreate = async (data: FormData) => {
    const result = await createRole(data)
    if (result.success) {
      router.push("/admin/roles")
      router.refresh()
    } else {
      if (result.errors) {
        addServerErrors(result.errors, form.setError)
      } else {
        toast({
          variant: "destructive",
          title: "Something went wrong",
        })
      }
    }
  }

  const onSubmitEdit = async (data: FormData) => {
    const result = await editRole({ id: Number(roleId), ...data })
    if (result.success) {
      form.reset({ ...data })
      router.refresh()
    } else {
      if (result.errors) {
        addServerErrors(result.errors, form.setError)
      } else {
        toast({
          variant: "destructive",
          title: "Something went wrong",
        })
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
                  placeholder=""
                  {...field}
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>
              <FormDescription>Role name</FormDescription>
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
                  placeholder=""
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
