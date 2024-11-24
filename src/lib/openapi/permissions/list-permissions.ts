import { z } from "zod"
import { ZodOpenApiOperationObject } from "zod-openapi"

import { listQuerySchema } from "@/schemas/api"
import { permissionOutputSchema } from "@/schemas/permissions"

import { internalServerErrorSchema, unauthorizedErrorSchema } from "../responses"

export const listPermissions: ZodOpenApiOperationObject = {
  operationId: "listPermissions",
  summary: "List permissions",
  description:
    "Retrieve a list of permissions with optional pagination, search, and sorting capabilities.",
  requestParams: {
    query: listQuerySchema,
  },
  responses: {
    "200": {
      description: "List Permissions",
      content: { "application/json": { schema: z.array(permissionOutputSchema) } },
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
  tags: ["Permissions"],
  security: [{ BearerAuth: [] }],
}
