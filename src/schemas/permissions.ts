import * as z from "zod"
import "zod-openapi/extend"

export const permissionPathParamSchema = z.object({
  roleId: z
    .number()
    .describe("The unique identifier of the permission.")
    .openapi({ example: 1 }),
})

export const permissionSchema = z.object({
  id: z
    .number()
    .describe("The unique identifier of the permission.")
    .openapi({ example: 1 }),
  name: z
    .string({ required_error: "Name is required." })
    .trim()
    .min(1, "Name must contain at least 1 character.")
    .max(45, "Name must contain at most 45 characters.")
    .describe("The name of the permission.")
    .openapi({ example: "Create post" }),
  description: z
    .string({ required_error: "Description is required." })
    .trim()
    .min(1, "Description must contain at least 1 character.")
    .max(255, "Description must contain at most 255 characters.")
    .describe("A detailed description of the permission.")
    .openapi({ example: "A user who can create a post" }),
  key: z
    .string({ required_error: "Key is required." })
    .trim()
    .refine((data) => /^[a-zA-Z0-9_]+:[a-zA-Z0-9_]+$/.test(data), {
      message: "The permission must follow the format 'feature:action'.",
    })
    .refine((data) => data.length <= 255, {
      message: "Key must contain at most 255 characters.",
    })
    .describe(
      "The key that uniquely identifies the permission, following the format 'feature:action'.",
    )
    .openapi({ example: "post:create" }),
  createdAt: z
    .date()
    .describe("The date and time when the permission was created.")
    .openapi({ example: new Date("2024-05-26T01:36:52.676Z") }),
  updatedAt: z
    .date()
    .describe("The date and time when the permission was last updated.")
    .openapi({ example: new Date("2024-05-26T01:36:52.676Z") }),
})

export const permissionServerActionSchema = permissionSchema
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .partial({ id: true })

export const permissionOutputSchema = permissionSchema

export const permissionCreateSchema = permissionSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const permissionUpdateSchema = z.object({
  ...permissionCreateSchema.shape,
})

export const permissionUpdatePartialSchema = permissionUpdateSchema.partial()
