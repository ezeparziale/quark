import { z } from "zod"
import "zod-openapi/extend"

const roleId = z
  .number()
  .describe("The unique identifier of the role.")
  .openapi({ example: 1 })

export const rolePathParamSchema = z.object({
  roleId,
})

export const roleSchema = z.object({
  id: roleId,
  name: z
    .string({ required_error: "Name is required." })
    .min(1, "Name must contain at least 1 character")
    .max(45, "Name must contain at most 45 characters")
    .describe("The name of the role.")
    .openapi({ example: "Blog Admin" }),
  description: z
    .string({ required_error: "Description is required." })
    .min(1, "Description must contain at least 1 character")
    .max(255, "Description must contain at most 255 characters")
    .describe("A detailed description of the role.")
    .openapi({
      example:
        "Administrator role with full access to manage blog posts and user comments.",
    }),
  key: z
    .string({ required_error: "Key is required." })
    .min(1, "Key must contain at least 1 character")
    .max(255, "Key must contain at most 255 characters")
    .regex(/^[a-z0-9]+$/, "Key must contain only lowercase letters and numbers.")
    .describe("The key that uniquely identifies the role.")
    .openapi({ example: "blog-admin" }),
  isActive: z
    .boolean()
    .describe("Define if the permission is active or not")
    .openapi({ examples: [false, true] }),
  tools: z
    .array(z.number())
    .describe("The tools assigned to the role.")
    .openapi({ example: [1, 2, 3] }),
  permissions: z
    .array(z.number())
    .describe("The permissions assigned to the role.")
    .openapi({ example: [101, 102, 103] }),
  createdAt: z
    .date()
    .describe("The date and time when the role was created.")
    .openapi({ example: new Date("2024-05-26T01:36:52.676Z") }),
  updatedAt: z
    .date()
    .describe("The date and time when the role was last updated.")
    .openapi({ example: new Date("2024-07-21T01:36:52.676Z") }),
})

export const roleServerActionCreateSchema = roleSchema
  .omit({
    id: true,
    tools: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    permissions: z
      .array(
        z.object({
          label: z.string(),
          value: z.string(),
          disable: z.boolean().optional(),
        }),
      )
      .optional()
      .describe("The permissions assigned to the role."),
  })

export const roleServerActionUpdateSchema = roleSchema.omit({
  tools: true,
  permissions: true,
  createdAt: true,
  updatedAt: true,
})

const permissionItemSchema = z.object({
  id: z
    .number()
    .describe("The unique identifier of the permission.")
    .openapi({ example: 1 }),
  name: z
    .string()
    .describe("The name of the permission.")
    .openapi({ example: "Create post" }),
})

const toolItemSchema = z.object({
  id: z.number().describe("The unique identifier of the tool.").openapi({ example: 2 }),
  name: z.string().describe("The name of the tool.").openapi({ example: "Blog" }),
})

export const roleOutputSchema = roleSchema
  .omit({ tools: true, permissions: true })
  .extend({
    permissions: z.array(permissionItemSchema),
    tools: z.array(toolItemSchema),
  })

export const roleCreateSchema = roleSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    tools: roleSchema.shape.tools.optional(),
    permissions: roleSchema.shape.permissions.optional(),
  })

export const roleUpdateSchema = roleCreateSchema.extend({
  tools: roleSchema.shape.tools,
  permissions: roleSchema.shape.permissions,
})

export const roleUpdatePartialSchema = roleUpdateSchema.partial()
