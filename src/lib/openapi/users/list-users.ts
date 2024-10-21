import * as z from "zod"
import { ZodOpenApiOperationObject } from "zod-openapi"

import { userListQuerySchema, userOutputSchema } from "@/schemas/users"

import { internalServerErrorSchema, unauthorizedErrorSchema } from "../responses"

export const listUsers: ZodOpenApiOperationObject = {
  operationId: "listUsers",
  summary: "List users",
  description:
    "Retrieve a list of users with optional pagination, search, and sorting capabilities.",
  requestParams: {
    query: userListQuerySchema,
  },
  responses: {
    "200": {
      description: "List Users",
      content: { "application/json": { schema: z.array(userOutputSchema) } },
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
  tags: ["Users"],
  security: [{ BearerAuth: [] }],
}
