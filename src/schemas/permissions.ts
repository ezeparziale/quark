import * as z from "zod"

const permissionId = z
  .number()
  .describe("The unique identifier of the permission.")
  .meta({ example: 1 })

export const permissionPathParamSchema = z.object({
  permissionId,
})

export const permissionSchema = z.object({
  id: permissionId,
  name: z
    .string({ error: "Name is required." })
    .trim()
    .min(1, "Name must contain at least 1 character.")
    .max(45, "Name must contain at most 45 characters.")
    .describe("The name of the permission.")
    .meta({ example: "Create post" }),
  description: z
    .string({ error: "Description is required." })
    .trim()
    .min(1, "Description must contain at least 1 character.")
    .max(255, "Description must contain at most 255 characters.")
    .describe("A detailed description of the permission.")
    .meta({ example: "A user who can create a post" }),
  key: z
    .string({ error: "Key is required." })
    .trim()
    .refine((data) => /^[a-z0-9_]+:[a-z0-9_]+$/.test(data), {
      message:
        "Key must follow the pattern 'feature:action', where both segments consist of one or more lowercase letters, digits, or underscores.",
    })
    .refine((data) => data.length <= 255, {
      message: "Key must contain at most 255 characters.",
    })
    .describe(
      "The key that uniquely identifies the permission, following the format 'feature:action'.",
    )
    .meta({ example: "post:create" }),
  isActive: z
    .boolean()
    .describe("Define if the permission is active or not")
    .meta({ examples: [false, true] }),
  createdAt: z
    .date()
    .describe("The date and time when the permission was created.")
    .meta({ example: new Date("2024-05-26T01:36:52.676Z") }),
  updatedAt: z
    .date()
    .describe("The date and time when the permission was last updated.")
    .meta({ example: new Date("2024-05-26T01:36:52.676Z") }),
})

export const permissionServerActionSchema = permissionSchema.omit({
  createdAt: true,
  updatedAt: true,
})

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
