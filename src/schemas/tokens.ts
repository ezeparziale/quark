import * as z from "zod"

const tokenId = z
  .string()
  .describe("The unique identifier of the token.")
  .meta({ example: "clz8y0nk60001bqz6f22yz5ad" })

export const tokenPathParamSchema = z.object({
  tokenId,
})

export const tokenSchema = z.object({
  id: tokenId,
  name: z
    .string()
    .min(1, { error: "Name must be at least 1 character long." })
    .max(255, { error: "Name must be at most 255 characters long." })
    .describe("The name of the token.")
    .meta({ example: "MyToken" }),
  hashedToken: z
    .string()
    .describe("The hashed representation of the token.")
    .meta({ example: "6ee2bbe6cf10c496f64f92cb36ab6c0fd3228a2715c5f9ae748837f25" }),
  partialToken: z
    .string()
    .describe("A partial representation of the token.")
    .meta({ example: "qrk...Rdj4" }),
  expires: z
    .date()
    .optional()
    .describe("The date and time when the token expires.")
    .meta({ example: new Date("2024-06-26T01:36:52.676Z") }),
  lastUsed: z
    .date()
    .optional()
    .describe("The date and time when the token was last used.")
    .meta({ example: new Date("2024-07-20T01:36:52.676Z") }),
  userId: z
    .number()
    .describe("The unique identifier of the user associated with the token.")
    .meta({ example: 123 }),
  createdAt: z
    .date()
    .describe("The date and time when the token was created.")
    .meta({ example: new Date("2024-05-26T01:36:52.676Z") }),
  updatedAt: z
    .date()
    .describe("The date and time when the token was last updated.")
    .meta({ example: new Date("2024-05-26T01:36:52.676Z") }),
})

export const tokenOutputSchema = tokenSchema
  .omit({ hashedToken: true })
  .describe("Schema for token output, omitting the hashed token.")

export const tokenCreateServerActionSchema = tokenSchema
  .pick({
    name: true,
    userId: true,
  })
  .extend({
    type: z.enum(["inherit", "custom"]),
    permissionIds: z.array(z.number()).optional(),
  })
  .describe(
    "Schema for creating a new token, requiring name, userId, type, and optional permissionIds.",
  )

export const tokenUpdateServerActionSchema = tokenSchema
  .pick({
    id: true,
    name: true,
  })
  .extend({
    isActive: z.boolean(),
    permissionIds: z.array(z.number()).optional(),
  })
  .describe("Schema for updating a token, allowing updates to the name and status.")
