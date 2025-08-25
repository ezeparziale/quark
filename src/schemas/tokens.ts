import * as z from "zod"

const tokenId = z
  .string()
  .describe("The unique identifier of the token.")
  .meta({ example: "clz8y0nk60001bqz6f22yz5ad" })

export const tokenPathParamSchema = z.object({
  tokenId,
})

const permissionIdsSchema = z
  .array(z.number())
  .nullable()
  .optional()
  .describe("The unique identifiers of the permissions associated with the token.")
  .meta({ example: [1, 2, 3] })

const permissionsSchema = z
  .array(z.object({ id: z.number(), name: z.string() }))
  .nullable()
  .optional()
  .describe("The permissions associated with the token.")
  .meta({ example: [{ id: 1, name: "Create post" }] })

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
    .nullable()
    .describe("The date and time when the token expires.")
    .meta({ example: new Date("2024-06-26T01:36:52.676Z") }),
  lastUsed: z
    .date()
    .optional()
    .nullable()
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
  type: z
    .enum(["inherit", "custom"])
    .describe("The type of the token, either 'inherit' or 'custom'.")
    .meta({ example: "custom" }),
  isActive: z
    .boolean()
    .describe("Indicates if the token is active.")
    .meta({ example: true }),
  permissionIds: permissionIdsSchema,
  permissions: permissionsSchema,
})

export const tokenOutputSchema = tokenSchema
  .omit({ hashedToken: true })
  .describe("Schema for token output, omitting the hashed token.")

export const tokenCreateOutputSchema = tokenOutputSchema.extend({
  token: z.string().meta({ example: "your_token_value_here" }),
})

export const tokenCreateSchema = tokenSchema
  .pick({
    name: true,
    userId: true,
    type: true,
    permissionIds: true,
  })
  .refine(
    (data) =>
      data.type !== "custom" ||
      (Array.isArray(data.permissionIds) && data.permissionIds.length > 0),
    {
      message: "You must select at least one permission when using custom permissions.",
      path: ["permissionIds"],
    },
  )

export const tokenUpdateSchema = tokenCreateSchema.extend({
  isActive: tokenSchema.shape.isActive,
})

export const tokenUpdatePartialSchema = tokenUpdateSchema.partial()

export type Token = z.infer<typeof tokenSchema>
export type TokenCreateInput = z.infer<typeof tokenCreateSchema>
export type TokenOutput = z.infer<typeof tokenOutputSchema>
