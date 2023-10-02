"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

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

export default function ForgotPasswordPage() {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormData>({
    defaultValues: {
      email: "",
    },
    resolver: yupResolver(formSchema),
  })

  async function onSubmit(data: FormData) {
    setIsLoading(true)
    await axios
      .post("/api/auth/reset_password", data)
      .then(() => {
        toast({
          title: "Check your email",
        })
        router.push("/auth/login")
      })
      .catch((error) => {
        toast({
          variant: "destructive",
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
        Reset your password
      </h2>
      <div className="my-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
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
                variant="default"
                size="sm"
                className="w-full font-bold"
                disabled={isLoading}
                type="submit"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Reset password
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