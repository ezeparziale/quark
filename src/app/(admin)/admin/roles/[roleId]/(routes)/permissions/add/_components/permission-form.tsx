"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { addPermissionsToRoles } from "@/actions/roles/add-permissions"
import { addServerErrors } from "@/lib/utils"
import { yupResolver } from "@hookform/resolvers/yup"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import * as yup from "yup"

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
import { toast } from "@/components/ui/use-toast"

const formSchema = yup.object({
  id: yup.array().of(yup.string()),
  roleId: yup.string().required(),
})

type FormData = yup.InferType<typeof formSchema>

type IPros = {
  title: string
  options: {
    value: string
    label: string
    disabled?: boolean
  }[]
  selectedValues: Set<string>
  roleId: string
}

export default function AddPermissionForm({
  options,
  selectedValues,
  title,
  roleId,
}: IPros) {
  const router = useRouter()

  const form = useForm<FormData>({
    defaultValues: {
      id: Array.from(selectedValues) || [],
      roleId: roleId,
    },
    resolver: yupResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    const result = await addPermissionsToRoles(data)
    if (result.success) {
      router.push(`/admin/roles/${roleId}/permissions`)
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

  const action = "Save"
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col space-y-8 md:w-2/3"
      >
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Permissions</FormLabel>
              <FormControl>
                <ComboboxMulti
                  title={title}
                  options={options}
                  selectedValues={selectedValues}
                  className="w-2/5"
                  form={form}
                />
              </FormControl>
              <FormDescription>Choose your permissions</FormDescription>
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
            <Link href={`/admin/roles/${roleId}/permissions`}>Cancel</Link>
          </Button>
        </div>
      </form>
    </Form>
  )
}
