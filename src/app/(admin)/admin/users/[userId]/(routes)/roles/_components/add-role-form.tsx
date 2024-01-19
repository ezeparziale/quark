"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { addRolesToUser } from "@/actions/users/add-roles"
import { addServerErrors } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { ComboboxMulti } from "@/components/combobox-multi"
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

const formSchema = z.object({
  rolesIds: z.array(z.number()),
  userId: z.string(),
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
  userId: string
}

const action = "Save"

export default function AddRoleForm({ options, selectedValues, title, userId }: IPros) {
  const router = useRouter()

  const form = useForm<FormData>({
    defaultValues: {
      rolesIds: Array.from(selectedValues) || [],
      userId: userId,
    },
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    const result = await addRolesToUser(data)
    if (result.success) {
      router.push(`/admin/users/${userId}/roles`)
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
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col space-y-8 md:w-2/3"
      >
        <FormField
          control={form.control}
          name="rolesIds"
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
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {action}
          </Button>
          <Button size="sm" className="w-full md:w-1/5" variant="outline" asChild>
            <Link href={`/admin/users/${userId}/roles`}>Cancel</Link>
          </Button>
        </div>
      </form>
    </Form>
  )
}
