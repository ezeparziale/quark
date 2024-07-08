import * as z from "zod"

const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
  disable: z.boolean().optional(),
})

export const rolesCreateSchema = z.object({
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
  toolId: z.number().optional(),
  permissions: z.array(optionSchema).optional(),
})

export const rolesUpdateSchema = z.object({
  id: z.number(),
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
  toolId: z.number().optional(),
})
