"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { addServerErrors } from "@/lib/utils"

import { addRolesToUser } from "@/actions/users/add-roles"

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
  userId: z.number(),
  roleIds: z.array(z.number()),
})

type FormData = z.infer<typeof formSchema>

type IPros = {
  title: string
  options: {
    value: number
    label: string
    disabled?: boolean
  }[]
  selectedValues: Set<number>
  userId: number
}

export default function AddRoleForm({ options, selectedValues, title, userId }: IPros) {
  const router = useRouter()

  const form = useForm<FormData>({
    defaultValues: {
      userId: userId,
      roleIds: Array.from(selectedValues) || [],
    },
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    const result = await addRolesToUser(data)
    if (result.success) {
      router.push(`/admin/users/${userId}/roles`)
      toast.success("Roles updated successfully!")
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
          name="roleIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Roles</FormLabel>
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
              <FormDescription>Choose your roles</FormDescription>
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
            <Link href={`/admin/users/${userId}/roles`}>Cancel</Link>
          </Button>
        </div>
      </form>
    </Form>
  )
}
