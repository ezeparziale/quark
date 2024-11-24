"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { addServerErrors } from "@/lib/utils"

import { addUsersToRoles } from "@/actions/roles"

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

import { ComboboxMulti } from "@/components/combobox-multi"

const formSchema = z.object({
  roleId: z.number(),
  userIds: z.array(z.number()),
})

type FormData = z.infer<typeof formSchema>

type Pros = {
  title: string
  options: {
    value: number
    label: string
    disabled?: boolean
  }[]
  selectedValues: Set<number>
  roleId: number
}

export default function AddUserForm({ options, selectedValues, title, roleId }: Pros) {
  const router = useRouter()

  const form = useForm<FormData>({
    defaultValues: {
      roleId: roleId,
      userIds: Array.from(selectedValues) || [],
    },
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    const result = await addUsersToRoles(data)
    if (result.success) {
      router.push(`/admin/roles/${roleId}/users`)
      toast.success("Users updated successfully!")
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
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col space-y-8 md:w-2/3"
      >
        <FormField
          control={form.control}
          name="userIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Users</FormLabel>
              <FormControl>
                <ComboboxMulti
                  title={title}
                  options={options}
                  selectedValues={selectedValues}
                  className="w-2/5"
                  form={form}
                  field={field.name}
                />
              </FormControl>
              <FormDescription>Choose your users</FormDescription>
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
            <Link href={`/admin/roles/${roleId}/users`}>Cancel</Link>
          </Button>
        </div>
      </form>
    </Form>
  )
}
