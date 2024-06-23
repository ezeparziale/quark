"use client"

import { useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { Angry, Frown, Loader2, Meh, Smile, SmilePlus } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { feedbackSchema } from "@/schemas/feedbacks"

import { addFeedback } from "@/actions/feedback"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const toggleGroupItemClasses = "p-2 rounded-full data-[state=on]:bg-primary/20 "

type FormData = z.infer<typeof feedbackSchema>

export const FEEDBACK_ITEMS = [
  { value: "1", Icon: Angry },
  { value: "2", Icon: Frown },
  { value: "3", Icon: Meh },
  { value: "4", Icon: Smile },
  { value: "5", Icon: SmilePlus },
]

export default function FeedbackButton() {
  const [isOpen, setOpen] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      feedback: "",
      nps: undefined,
    },
  })

  const onSubmit = async (data: FormData) => {
    const result = await addFeedback(data)
    if (result.success) {
      toast.success("Thank you for your feedback!")
      setOpen(false)
      form.reset()
    } else {
      toast.error("Error sending your feedback.")
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="" size={"sm"}>
          Feedback
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80"
        onCloseAutoFocus={() => {
          form.reset()
        }}
        align="center"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="feedback"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="Your feedback..."
                      {...field}
                      disabled={form.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-1 flex-col space-y-5">
              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="nps"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ToggleGroup
                          type="single"
                          className="flex items-center justify-between -space-x-1"
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          {...field}
                          disabled={form.formState.isSubmitting}
                        >
                          {FEEDBACK_ITEMS.map(({ value, Icon }) => (
                            <ToggleGroupItem
                              key={value}
                              value={value}
                              size="sm"
                              className={toggleGroupItemClasses}
                            >
                              <Icon className="size-5" />
                            </ToggleGroupItem>
                          ))}
                        </ToggleGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  variant={"default"}
                  size={"sm"}
                  type="submit"
                  disabled={
                    form.formState.isSubmitting || !form.formState.dirtyFields.feedback
                  }
                >
                  {form.formState.isSubmitting && (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  )}
                  Send
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  )
}
