"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

import { Suspense, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { Loader2 } from "lucide-react"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { GitHubIcon, GoogleIcon } from "@/lib/icons"

import { registerSchema } from "@/schemas/auth"

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

type FormData = z.infer<typeof registerSchema>

function RegisterForm() {
  const router = useRouter()

  const searchParams = useSearchParams()
  const callbackUrl: string = (searchParams.get("callbackUrl") as string) ?? "/"

  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormData>({
    defaultValues: { username: "", email: "", password: "", confirmPassword: "" },
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)

    await axios
      .post("/api/auth/register", data)
      .then(async () => {
        await axios.post("/api/auth/confirm", { email: data.email })
        toast.success("User created")
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
          toast.error("Something went wrong")
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <AuthTemplate>
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Sign up</h1>
      <p className="text-muted-foreground text-sm">
        Already have an account?{" "}
        <Link
          className="leading-6 font-semibold text-purple-600 hover:text-green-400"
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
            <Button size="sm" className="w-full" disabled={isLoading} type="submit">
              {isLoading && <Loader2 className="size-4 animate-spin" />}
              Sign up
            </Button>
          </form>
        </Form>
      </div>
      <div className="relative mt-8">
        <hr className="border-t border-gray-400" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-white px-3 text-sm text-gray-400 dark:bg-black">OR</span>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-2 md:grid-cols-2">
        <Button
          variant={"outline"}
          size="sm"
          className="gap-2"
          disabled={isLoading}
          onClick={() => signIn("google", { callbackUrl })}
        >
          <GoogleIcon className="size-4" />
          <span>Google</span>
        </Button>
        <Button
          variant={"outline"}
          size="sm"
          className="gap-2"
          disabled={isLoading}
          onClick={() => signIn("github", { callbackUrl })}
        >
          <GitHubIcon className="size-4" />
          <span>GitHub</span>
        </Button>
      </div>
    </AuthTemplate>
  )
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  )
}
