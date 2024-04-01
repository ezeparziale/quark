import * as z from "zod"

export const permissionSchema = z.object({
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
  key: z
    .string()
    .trim()
    .refine((data) => /^[a-zA-Z0-9_]+:[a-zA-Z0-9_]+$/.test(data), {
      message: "The permission must follow the format 'feature:permission'",
    })
    .refine((data) => data.length <= 255, {
      message: "Key must contain at most 255 characters",
    }),
})
