"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { zodResolver } from "@hookform/resolvers/zod"
import type { Tool } from "@prisma/client"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { addServerErrors } from "@/lib/utils"

import { toolSchema } from "@/schemas/tools"

import { createTool, updateTool } from "@/actions/tools"

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

type FormData = z.infer<typeof toolSchema>

export default function ToolForm({ tool }: { tool?: Tool }) {
  const router = useRouter()

  const form = useForm<FormData>({
    defaultValues: {
      id: tool?.id || undefined,
      name: tool?.name || "",
      description: tool?.description || "",
      href: tool?.href || "",
      icon: tool?.icon || "",
    },
    resolver: zodResolver(toolSchema),
  })

  const action = tool ? "Update" : "Create"

  const onSubmitCreate = async (data: FormData) => {
    const result = await createTool(data)
    if (result.success) {
      router.push("/admin/tools")
      toast.success("Tool created successfully!")
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
    const result = await updateTool(data)
    if (result.success) {
      form.reset({ ...data })
      router.refresh()
      toast.success("Tool updated successfully!")
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Blog"
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
                  placeholder="e.g. Blog app for shared posts"
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
          name="href"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Href</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. /tools/blog"
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
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. notebook-pen"
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
            {action}
          </Button>
          <Button size="sm" className="w-full md:w-1/5" variant="outline" asChild>
            <Link href="/admin/tools/">Cancel</Link>
          </Button>
        </div>
      </form>
    </Form>
  )
}
