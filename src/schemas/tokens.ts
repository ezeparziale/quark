import * as z from "zod"
import "zod-openapi/extend"

const tokenId = z
  .number()
  .describe("The unique identifier of the token.")
  .openapi({ example: 1 })

export const tokenPathParamSchema = z.object({
  tokenId,
})

export const tokenSchema = z.object({
  id: tokenId,
  name: z
    .string()
    .min(1, { message: "Name must be at least 1 character long." })
    .max(255, { message: "Name must be at most 255 characters long." })
    .describe("The name of the token.")
    .openapi({ example: "MyToken" }),
  hashedToken: z
    .string()
    .describe("The hashed representation of the token.")
    .openapi({ example: "XXXXXXXXXXX" }),
  partialToken: z
    .string()
    .describe("A partial representation of the token.")
    .openapi({ example: "qkr_XXXX" }),
  expires: z
    .date()
    .optional()
    .describe("The date and time when the token expires.")
    .openapi({ example: new Date("2024-06-26T01:36:52.676Z") }),
  lastUsed: z
    .date()
    .optional()
    .describe("The date and time when the token was last used.")
    .openapi({ example: new Date("2024-07-20T01:36:52.676Z") }),
  userId: z
    .number()
    .describe("The unique identifier of the user associated with the token.")
    .openapi({ example: 123 }),
  createdAt: z
    .date()
    .describe("The date and time when the token was created.")
    .openapi({ example: new Date("2024-05-26T01:36:52.676Z") }),
  updatedAt: z
    .date()
    .describe("The date and time when the token was last updated.")
    .openapi({ example: new Date("2024-05-26T01:36:52.676Z") }),
})

export const tokenOutputSchema = tokenSchema
  .omit({ hashedToken: true })
  .describe("Schema for token output, omitting the hashed token.")

export const tokenCreateSchema = tokenSchema
  .pick({
    name: true,
  })
  .describe("Schema for creating a new token, requiring only the name.")

export const tokenUpdateSchema = z
  .object({
    ...tokenCreateSchema.shape,
  })
  .describe("Schema for updating a token, allowing updates to the name.")

export const tokenUpdatePartialSchema = tokenUpdateSchema
  .partial()
  .describe("Schema for partially updating a token, with all fields optional.")
