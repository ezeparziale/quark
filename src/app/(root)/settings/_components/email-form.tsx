"use client"

import { updateEmail } from "@/actions/update-user"
import { yupResolver } from "@hookform/resolvers/yup"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import * as yup from "yup"

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

const formSchema = yup.object({
  newEmail: yup.string().email().required(),
})

type FormData = yup.InferType<typeof formSchema>

function addServerErrors<T>(
  errors: { [P in keyof T]?: string[] },
  setError: (fieldName: keyof T, error: { type: string; message: string }) => void,
) {
  return Object.keys(errors).forEach((key) => {
    setError(key as keyof T, {
      type: "server",
      message: errors[key as keyof T]!.join(". "),
    })
  })
}

export default function EmailForm({ email }: { email: string }) {
  const form = useForm<FormData>({
    defaultValues: {
      newEmail: email || "",
    },
    resolver: yupResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    const result = await updateEmail(data)
    if (result.success) {
      form.reset({ newEmail: data.newEmail })
    } else {
      if (result.errors) {
        form.reset({ ...form.formState.defaultValues })
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
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col space-y-4 md:w-2/3"
      >
        <FormField
          control={form.control}
          name="newEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder=""
                  {...field}
                  disabled={form.formState.isSubmitting}
                  autoComplete="email"
                />
              </FormControl>
              <FormDescription>We will email you to verify the change.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          size="sm"
          className="w-full md:w-1/5"
          disabled={form.formState.isSubmitting || !form.formState.isDirty}
          type="submit"
        >
          {form.formState.isSubmitting && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Save
        </Button>
      </form>
    </Form>
  )
}
