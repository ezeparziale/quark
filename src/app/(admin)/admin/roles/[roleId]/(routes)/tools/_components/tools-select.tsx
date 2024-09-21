"use client"

import Link from "next/link"

import { useEffect, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { Tool } from "@prisma/client"
import { Loader2, Trash } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { addToolsToRoles } from "@/actions/roles/add-tools"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

const formSchema = z.object({
  toolId: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

export default function ToolsSelect({
  tools,
  roleId,
  toolSelected,
}: {
  tools: Tool[]
  roleId: number
  toolSelected: number | undefined
}) {
  const [mounted, setMounted] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      toolId: toolSelected ? String(toolSelected) : undefined,
    },
  })

  async function onSubmit(data: FormData) {
    const toolsIds = data.toolId === "" ? undefined : [Number(data.toolId)]

    const result = await addToolsToRoles({
      roleId,
      toolsIds,
    })
    if (result.success) {
      toast.success("Tools updated successfully!")
      form.reset({ toolId: data.toolId }, { keepDirty: false })
    } else {
      toast.error(result.message)
    }
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col space-y-6 md:w-2/3"
      >
        <FormField
          control={form.control}
          name="toolId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tools</FormLabel>
              <div className="flex items-center justify-between gap-1">
                {!mounted ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder="Select a tool"
                            defaultValue={field.value}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tools.map((tool) => (
                          <SelectItem key={tool.id} value={String(tool.id)}>
                            {tool.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {field.value && (
                      <Button
                        type="button"
                        size={"icon"}
                        variant={"ghost"}
                        onClick={() => {
                          form.setValue(field.name, "", { shouldDirty: true })
                        }}
                      >
                        <Trash className="size-4 text-muted-foreground" />
                      </Button>
                    )}
                  </>
                )}
              </div>
              <FormDescription>
                Can you assign the role to a specific tool, or would you prefer to save
                it without assigning?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col space-y-4">
          <Button
            size="sm"
            className="w-full md:w-1/5"
            disabled={form.formState.isSubmitting || !form.formState.isDirty}
            type="submit"
          >
            {form.formState.isSubmitting && (
              <Loader2 className="mr-2 size-4 animate-spin" />
            )}
            Save
          </Button>
          <Button size="sm" className="w-full md:w-1/5" variant="outline" asChild>
            <Link href={`/admin/roles/`}>Cancel</Link>
          </Button>
        </div>
      </form>
    </Form>
  )
}
