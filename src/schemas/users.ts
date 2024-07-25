import * as z from "zod"
import "zod-openapi/extend"

const userId = z
  .number()
  .describe("The unique identifier of the user.")
  .openapi({ example: 1 })

export const userPathParamSchema = z.object({
  userId,
})

export const userSchema = z.object({
  id: userId,
  email: z.string().email("Please add a valid email"),
  username: z
    .string()
    .trim()
    .min(1, "Username must contain at least 1 character")
    .max(255, "Username must contain at most 255 characters"),
  active: z.boolean(),
  confirmedEmail: z.boolean(),
  createdAt: z
    .date()
    .describe("The date and time when the permission was created.")
    .openapi({ example: new Date("2024-05-26T01:36:52.676Z") }),
  updatedAt: z
    .date()
    .describe("The date and time when the permission was last updated.")
    .openapi({ example: new Date("2024-05-26T01:36:52.676Z") }),
})

export const userServerActionSchema = userSchema
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .partial({ id: true })

export const userOutputSchema = userSchema

export const userCreateSchema = userSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const userUpdateSchema = z.object({
  ...userCreateSchema.shape,
})

export const userUpdatePartialSchema = userUpdateSchema.partial()
