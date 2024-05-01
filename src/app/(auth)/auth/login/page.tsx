"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

import { Suspense, useEffect, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { FaGoogle } from "react-icons/fa6"
import { toast } from "sonner"
import * as z from "zod"

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

const formSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type FormData = z.infer<typeof formSchema>

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
        toast("Please login with your new email", { id: updatedEmail })
      }
    }, 100)
  }, [updatedEmail])

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
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
          toast.error("Wrong credentials")
        }
      }
    })
  }

  return (
    <AuthTemplate>
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Log in</h1>
      <p className="text-sm text-muted-foreground">
        New to Quark?{" "}
        <Link
          className="font-semibold leading-6 text-purple-600 hover:text-green-400"
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
                className="text-sm font-semibold leading-6 text-purple-600 hover:text-green-400"
              >
                Forgot password?
              </Link>
            </div>
            <Button size="sm" className="w-full" disabled={isLoading} type="submit">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Log in
            </Button>
          </form>
        </Form>
      </div>
      <div className="relative mt-8">
        <hr className="border-t border-gray-400" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-white px-3 text-sm text-gray-400 dark:bg-black">
            Or with
          </span>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1">
        <Button
          className="w-full"
          size="sm"
          disabled={isLoading}
          onClick={() => signIn("google", { callbackUrl })}
        >
          <FaGoogle className="mr-2" /> Google
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
