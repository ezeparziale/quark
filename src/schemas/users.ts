import * as z from "zod"

export const userSchema = z.object({
  id: z.string().optional(),
  email: z.string().email("Please add a valid email"),
  username: z
    .string()
    .trim()
    .min(1, "Username must contain at least 1 character")
    .max(255, "Username must contain at most 255 characters"),
  active: z.boolean(),
  confirmedEmail: z.boolean(),
})
