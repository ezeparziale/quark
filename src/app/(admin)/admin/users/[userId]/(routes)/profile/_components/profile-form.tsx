"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { userUpdateProfileSchema } from "@/schemas/users"

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

type Profile = {
  firstName: string | null
  lastName: string | null
  bio: string | null
  phone: string | null
  websiteUrl: string | null
  linkedinUrl: string | null
  githubUrl: string | null
  jobTitle: string | null
  department: string | null
}

type FormData = z.infer<typeof userUpdateProfileSchema>

export function ProfileForm({ profile, userId }: { profile: Profile; userId: number }) {
  const form = useForm<FormData>({
    defaultValues: {
      firstName: profile.firstName,
      lastName: profile.lastName,
      bio: profile.bio,
      phone: profile.phone,
      websiteUrl: profile.websiteUrl,
      linkedinUrl: profile.linkedinUrl,
      githubUrl: profile.githubUrl,
      jobTitle: profile.jobTitle,
      department: profile.department,
    },
    resolver: zodResolver(userUpdateProfileSchema),
    mode: "onChange",
  })

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch(`/api/v1/users/${userId}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to save metadata")
      }

      toast.success("Profile saved successfully")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save metadata")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="John" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Doe" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Input
                  placeholder="I'm a software engineer..."
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input
                  placeholder="+1 234 567 890"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="websiteUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="linkedinUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LinkedIn</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://linkedin.com/in/johndoe"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="githubUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GitHub</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://github.com/johndoe"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="jobTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Software Engineer"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <FormControl>
                <Input placeholder="Engineering" {...field} value={field.value ?? ""} />
              </FormControl>
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
          {form.formState.isSubmitting && <Loader2 className="size-4 animate-spin" />}
          {form.formState.isSubmitting ? "Saving..." : "Save"}
        </Button>{" "}
      </form>
    </Form>
  )
}
