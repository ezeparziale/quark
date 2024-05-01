"use client"

import { useRouter } from "next/navigation"

import { useEffect, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import type { Role } from "@prisma/client"
import { Loader2, Trash2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { deleteRole } from "@/actions/roles"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export default function DeleteRoleModal({ role }: { role: Role }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const formSchema = z.object({
    confirmString: z.literal(role.key, {
      errorMap: () => ({ message: "Incorrect role key" }),
    }),
  })

  type FormData = z.infer<typeof formSchema>

  const form = useForm<FormData>({
    defaultValues: { confirmString: "" },
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async () => {
    const result = await deleteRole(role)
    if (result.success) {
      toast.success("Role deleted successfully!", { duration: 4000 })
      router.push("/admin/roles")
    } else {
      toast.error(result.message)
    }
  }

  useEffect(() => {
    if (isOpen === false) {
      form.reset()
    }
  }, [isOpen, form])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 className="size-4" />
              <span className="sr-only">delete role</span>
              <span className="ml-2 hidden md:block">Delete role</span>
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent className="border-destructive md:hidden" align={"end"}>
          <p>Delete role</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete role</DialogTitle>
          <DialogDescription>
            This action is permanent and could result in users losing access to your
            application.
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="flex flex-col items-start space-y-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex w-full flex-col space-y-4"
            >
              <FormField
                control={form.control}
                name="confirmString"
                render={({ field }) => (
                  <FormItem>
                    <FormDescription>
                      Enter the role key <b>{role.key}</b> to continue.
                    </FormDescription>
                    <FormControl>
                      <Input
                        placeholder=""
                        {...field}
                        disabled={form.formState.isSubmitting}
                        autoComplete="no"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsOpen(false)
                  }}
                  type="button"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  disabled={form.formState.isSubmitting || !form.formState.isDirty}
                  type="submit"
                >
                  {form.formState.isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Delete role
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
