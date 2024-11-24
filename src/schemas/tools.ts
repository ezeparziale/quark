import { z } from "zod"

export const toolSchema = z.object({
  id: z.number().optional(),
  name: z
    .string()
    .trim()
    .min(1, "Name must contain at least 1 character")
    .max(45, "Name must contain at most 45 characters"),
  description: z
    .string()
    .trim()
    .min(1, "Description must contain at least 1 character")
    .max(255, "Description must contain at most 255 characters"),
  href: z
    .string()
    .trim()
    .min(1, "Href must contain at least 1 character")
    .max(255, "Href must contain at most 255 characters"),
  icon: z
    .string()
    .trim()
    .min(1, "Icon must contain at least 1 character")
    .max(255, "Icon must contain at most 255 characters"),
})
