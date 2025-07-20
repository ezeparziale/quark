import * as z from "zod"
import { ZodOpenApiOperationObject } from "zod-openapi"

import { listQuerySchema } from "@/schemas/api"
import { roleOutputSchema } from "@/schemas/roles"

import { internalServerErrorSchema, unauthorizedErrorSchema } from "../responses"

export const listRoles: ZodOpenApiOperationObject = {
  operationId: "listRoles",
  summary: "List roles",
  description:
    "Retrieve a list of roles with optional pagination, search, and sorting capabilities.",
  requestParams: {
    query: listQuerySchema,
  },
  responses: {
    "200": {
      description: "List Roles",
      content: { "application/json": { schema: z.array(roleOutputSchema) } },
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
  tags: ["Roles"],
  security: [{ BearerAuth: [] }],
}
