"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

import { Suspense, useEffect, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { GitHubIcon, GoogleIcon } from "@/lib/icons"

import { loginSchema } from "@/schemas/auth"

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

type FormData = z.infer<typeof loginSchema>

function LoginForm() {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)

  const searchParams = useSearchParams()
  const callbackUrl: string = (searchParams.get("callbackUrl") as string) ?? "/tools"
  const activated = searchParams?.get("activated") ?? null
  const updatedEmail = searchParams?.get("updatedEmail") ?? null

  useEffect(() => {
    setTimeout(() => {
      if (activated === "1") {
        toast.success("Account activated", { id: activated })
      }
    }, 100)
  }, [activated])

  useEffect(() => {
    setTimeout(() => {
      if (updatedEmail === "1") {
        toast.info("Please login with your new email", { id: updatedEmail })
      }
    }, 100)
  }, [updatedEmail])

  const form = useForm<FormData>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: FormData) => {
    setIsLoading(true)

    signIn("credentials", {
      ...data,
      redirect: false,
    }).then((callback) => {
      setIsLoading(false)

      if (!callback?.error) {
        router.push(callbackUrl)
      }

      if (callback?.error) {
        if (callback?.error === "AccessDenied") {
          router.push("/auth/error/?error=AccessDenied")
        }
        if (callback?.error === "ConfirmEmail") {
          router.push("/auth/error/?error=ConfirmEmail")
        } else {
          toast.error("Invalid credentials")
        }
      }
    })
  }

  return (
    <AuthTemplate>
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Log in</h1>
      <p className="text-muted-foreground text-sm">
        New to Quark?{" "}
        <Link
          className="leading-6 font-semibold text-purple-600 hover:text-green-400"
          href="/auth/register"
        >
          Sign up for an account
        </Link>
      </p>
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
            <div className="flex flex-row items-center justify-between pb-6">
              <Link
                href="/auth/reset-password"
                className="text-sm leading-6 font-semibold text-purple-600 hover:text-green-400 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Button size="sm" className="w-full" disabled={isLoading} type="submit">
              {isLoading && <Loader2 className="size-4 animate-spin" />}
              Login
            </Button>
          </form>
        </Form>
      </div>
      <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
        <span className="bg-background text-muted-foreground relative z-10 px-2">
          Or continue with
        </span>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-2 md:grid-cols-2">
        <Button
          variant="outline"
          size="sm"
          disabled={isLoading}
          onClick={() => signIn("google", { callbackUrl })}
        >
          <GoogleIcon className="size-4" />
          <span>Google</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
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

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
