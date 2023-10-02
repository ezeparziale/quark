"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

import { useState } from "react"

import { yupResolver } from "@hookform/resolvers/yup"
import { Loader2 } from "lucide-react"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { FaGoogle } from "react-icons/fa6"
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
  password: yup.string().required("Password is required"),
})

type FormData = yup.InferType<typeof formSchema>

export default function LoginPage() {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)

  const searchParams = useSearchParams()
  const callbackUrl: string = (searchParams.get("callbackUrl") as string) ?? "/"
  const activated = searchParams.has("activated")

  const form = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(formSchema),
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
          toast({
            variant: "destructive",
            title: "Wrong credentials",
          })
        }
      }
    })
  }

  if (activated) {
    toast({
      title: "Account activated",
    })
  }

  return (
    <AuthTemplate>
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-slate-50 md:text-2xl">
        Log in
      </h2>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        New to Quark?{" "}
        <Link
          className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
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
                href="/auth/reset_password"
                className="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >
                Forgot password?
              </Link>
            </div>
            <Button
              size="sm"
              className="w-full font-bold"
              disabled={isLoading}
              type="submit"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Log in
            </Button>
          </form>
        </Form>
      </div>
      <div className="relative mt-8">
        <hr className="border-t border-gray-400 " />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-white px-3 text-sm text-gray-400 dark:bg-black">
            Or with
          </span>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1">
        <Button
          className="w-full font-bold"
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