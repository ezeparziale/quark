"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

import { useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { Loader2 } from "lucide-react"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { FaGoogle } from "react-icons/fa6"
import * as z from "zod"

import AuthTemplate from "@/components/auth/auth-template"
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
import { toast, useToast } from "@/components/ui/use-toast"

const formSchema = z
  .object({
    username: z.string().trim().min(1).max(60),
    email: z.string().email(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(60, "Password must not exceed 60 characters"),
    confirmPassword: z.string({ required_error: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type FormData = z.infer<typeof formSchema>

export default function RegisterPage() {
  const router = useRouter()

  const searchParams = useSearchParams()
  const callbackUrl: string = (searchParams.get("callbackUrl") as string) ?? "/"

  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)

    const resp = await axios
      .post("/api/auth/register", data)
      .then(async () => {
        await axios.post("/api/auth/confirm", { email: data.email })
        toast({
          title: "User created",
        })
        router.push("/auth/login")
      })
      .catch((error) => {
        const errors = error.response.data

        if (errors) {
          errors.forEach(
            (errorData: { field: "username" | "email"; message: string }) =>
              form.setError(errorData.field, {
                type: "custom",
                message: errorData.message,
              }),
          )
        } else {
          toast({
            variant: "destructive",
            title: "Something went wrong",
          })
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <AuthTemplate>
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-slate-50 md:text-2xl">
        Sign up
      </h2>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        Already have an account?{" "}
        <Link
          className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          href="/auth/login"
        >
          Log in
        </Link>
      </p>
      <div className="my-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                      disabled={isLoading}
                      type="password"
                      autoComplete="on"
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
                      disabled={isLoading}
                      type="password"
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              size="sm"
              className="w-full font-bold"
              disabled={isLoading}
              type="submit"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign up
            </Button>
          </form>
        </Form>
      </div>
      <div className="relative mt-8">
        <hr className="border-t border-gray-400 " />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-white px-3 text-sm text-gray-400 dark:bg-black">OR</span>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1">
        <Button
          size="sm"
          className="w-full font-bold"
          disabled={isLoading}
          onClick={() => signIn("google", { callbackUrl })}
        >
          <FaGoogle className="mr-2" /> Google
        </Button>
      </div>
    </AuthTemplate>
  )
}
