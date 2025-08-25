import * as z from "zod"
import { ZodOpenApiOperationObject } from "zod-openapi"

import { listQuerySchema } from "@/schemas/api"
import { tokenOutputSchema } from "@/schemas/tokens"

import { internalServerErrorSchema, unauthorizedErrorSchema } from "../responses"

export const listTokens: ZodOpenApiOperationObject = {
  operationId: "listTokens",
  summary: "List tokens",
  description:
    "Retrieve a list of tokens with optional pagination, search, and sorting capabilities.",
  requestParams: {
    query: listQuerySchema,
  },
  responses: {
    "200": {
      description: "List Tokens",
      content: { "application/json": { schema: z.array(tokenOutputSchema) } },
    },
    "401": {
      description: "Unauthorized Error",
      content: {
        "application/json": {
          schema: unauthorizedErrorSchema,
        },
      },
    },
    "500": {
      description: "Internal Server Error",
      content: {
        "application/json": {
          schema: internalServerErrorSchema,
        },
      },
    },
  },
  tags: ["Tokens"],
  security: [{ BearerAuth: [] }],
}
