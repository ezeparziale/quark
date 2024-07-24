import { ZodOpenApiOperationObject } from "zod-openapi"

import { roleOutputSchema, rolePathParamSchema } from "@/schemas/roles"

import {
  badRequestErrorSchema,
  internalServerErrorSchema,
  notFoundErrorSchema,
  unauthorizedErrorSchema,
} from "../responses"

export const readRole: ZodOpenApiOperationObject = {
  operationId: "readRole",
  summary: "Read a role by ID",
  description: "Retrieve details of a specific role using its ID.",
  requestParams: { path: rolePathParamSchema },
  responses: {
    "200": {
      description: "Read Role",
      content: { "application/json": { schema: roleOutputSchema } },
    },
    "400": {
      description: "Bad Request",
      content: {
        "application/json": {
          schema: badRequestErrorSchema,
          example: {
            message: "Invalid ID supplied",
          },
        },
      },
    },
    "401": {
      description: "Unauthorized Error",
      content: {
        "application/json": {
          schema: unauthorizedErrorSchema,
        },
      },
    },
    "404": {
      description: "Not Found",
      content: {
        "application/json": {
          schema: notFoundErrorSchema,
          example: {
            message: "Role not found",
          },
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
