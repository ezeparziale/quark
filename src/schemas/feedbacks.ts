import * as z from "zod"

export const feedbackSchema = z.object({
  feedback: z
    .string()
    .min(1, "Please provide your feedback")
    .max(1000, "Too long, please shorten your feedback"),
  nps: z.string().optional(),
})
