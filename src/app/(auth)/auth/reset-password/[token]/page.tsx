"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { resetPasswordSchema } from "@/schemas/auth"

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

import AuthTemplate from "@/components/auth/auth-template"

type FormData = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordTokenPage({
  params,
}: {
  params: { token: string }
}) {
  const router = useRouter()

  const form = useForm<FormData>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (data: FormData) => {
    await axios
      .post(`/api/auth/reset-password/${params.token}`, data)
      .then(() => {
        toast.success("Password updated")
        router.push("/auth/login")
      })
      .catch((error) => {
        if (error.response.status == 401) {
          router.push("/auth/reset-password")
          toast.error(error.response.data.message)
        } else {
          toast.error("Something went wrong")
        }
      })
  }

  return (
    <AuthTemplate>
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
        Reset your password
      </h1>
      <div className="my-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      {...field}
                      disabled={form.formState.isSubmitting}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder=""
                      {...field}
                      disabled={form.formState.isSubmitting}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col items-center justify-center space-y-3">
              <Button
                variant="default"
                size="sm"
                className="w-full"
                disabled={form.formState.isSubmitting}
                type="submit"
              >
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                Change password
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/auth/reset-password">Back</Link>
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </AuthTemplate>
  )
}
