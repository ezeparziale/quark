"use client"

import { useCallback, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { Code, Copy, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface MetadataEditorProps {
  userId: number
  userMetadata?: string | null
}

const formSchema = z.object({
  metadata: z.string().superRefine((val, ctx) => {
    try {
      JSON.parse(val)
    } catch (error) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: error instanceof Error ? error.message : "Invalid JSON format",
      })
    }
  }),
})

type FormData = z.infer<typeof formSchema>

export function MetadataEditor({ userId, userMetadata }: MetadataEditorProps) {
  const [isFormatting, setIsFormatting] = useState(false)

  const form = useForm<FormData>({
    defaultValues: {
      metadata: userMetadata ?? "",
    },
    resolver: zodResolver(formSchema),
    mode: "onChange",
  })

  const handleFormatWithError = useCallback(
    (json: string) => {
      try {
        return JSON.stringify(JSON.parse(json), null, 2)
      } catch (error) {
        form.setError("metadata", {
          type: "manual",
          message: error instanceof Error ? error.message : "Invalid JSON format",
        })
        return json
      }
    },
    [form],
  )

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData("text")
    form.setValue("metadata", handleFormatWithError(pastedText), {
      shouldValidate: true,
    })
  }

  const handleFormat = async () => {
    setIsFormatting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 100))
      const formatted = handleFormatWithError(form.getValues("metadata"))
      form.setValue("metadata", formatted, { shouldValidate: true })
    } finally {
      setIsFormatting(false)
    }
  }

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(form.getValues("metadata")).then(() => {
      toast.success("Metadata copied to clipboard")
    })
  }, [form])

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch(`/api/v1/users/${userId}/metadata`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ metadata: JSON.parse(data.metadata) }),
      })

      if (!response.ok) {
        throw new Error("Failed to save metadata")
      }

      handleFormat()
      toast.success("Metadata saved successfully")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save metadata")
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col space-y-4 md:w-2/3"
      >
        <div className="relative">
          <div className="absolute right-2 top-0.5 flex items-center space-x-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleCopy}
                  className="h-7 w-7"
                  disabled={isFormatting}
                >
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy JSON</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copy JSON</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleFormat}
                  className="h-7 w-7"
                  disabled={isFormatting}
                >
                  {isFormatting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Code className="h-4 w-4" />
                  )}
                  <span className="sr-only">Format JSON</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Format JSON</TooltipContent>
            </Tooltip>
          </div>
          <FormField
            control={form.control}
            name="metadata"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Metadata</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Enter JSON metadata here"
                    onPaste={handlePaste}
                    rows={10}
                    className="pr-16 font-mono"
                    disabled={form.formState.isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          size="sm"
          className="w-full md:w-1/5"
          disabled={form.formState.isSubmitting || !form.formState.isDirty}
          type="submit"
        >
          {form.formState.isSubmitting && (
            <Loader2 className="mr-2 size-4 animate-spin" />
          )}
          {form.formState.isSubmitting ? "Saving..." : "Save"}
        </Button>
      </form>
    </Form>
  )
}
