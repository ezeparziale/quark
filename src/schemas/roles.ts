import * as z from "zod"

export const rolesSchema = z.object({
  id: z.number().optional(),
  name: z
    .string()
    .min(1, "Name must contain at least 1 character")
    .max(45, "Name must contain at most 45 characters"),
  description: z
    .string()
    .min(1, "Description must contain at least 1 character")
    .max(255, "Description must contain at most 255 characters"),
  key: z
    .string()
    .min(1, "Key must contain at least 1 character")
    .max(255, "Key must contain at most 255 characters"),
})
