"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

import { useState } from "react"

import { yupResolver } from "@hookform/resolvers/yup"
import axios from "axios"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import * as yup from "yup"

import AuthTemplate from "@/components/auth/authTemplate"
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
import { toast } from "@/components/ui/use-toast"

const formSchema = yup.object({
  email: yup.string().email().required(),
})

type FormData = yup.InferType<typeof formSchema>

export default function ConfirmEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [isLoading, setIsLoading] = useState(false)
  const error = searchParams.has("error")

  const form = useForm<FormData>({
    defaultValues: {
      email: "",
    },
    resolver: yupResolver(formSchema),
  })

  if (error) {
    toast({
      variant: "destructive",
      title: "Token expired or invalid",
    })
  }

  async function onSubmit(data: FormData) {
    setIsLoading(true)

    await axios
      .post("/api/auth/confirm", data)
      .then(() => {
        toast({
          title: "Check your email",
        })
        router.push("/auth/login")
      })
      .catch((error) => {
        toast({
          title: "Something went wrong",
        })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <AuthTemplate>
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-slate-50 md:text-2xl">
        Your email address has not been confirmed yet
      </h2>
      <p className="pt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
        To access all the features of our platform, please verify your email or request
        a new confirmation email.
      </p>
      <div className="my-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col items-center justify-center space-y-3">
              <Button
                size="sm"
                className="w-full font-bold"
                disabled={isLoading}
                type="submit"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send verification
              </Button>
              <Button asChild variant="ghost" size="sm" className="font-bold">
                <Link href="/auth/login">Back to login</Link>
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </AuthTemplate>
  )
}
