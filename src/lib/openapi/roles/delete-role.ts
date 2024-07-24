import { ZodOpenApiOperationObject } from "zod-openapi"

import "@/schemas/roles"
import { rolePathParamSchema } from "@/schemas/roles"

import {
  badRequestErrorSchema,
  internalServerErrorSchema,
  notFoundErrorSchema,
  unauthorizedErrorSchema,
} from "../responses"

export const deleteRole: ZodOpenApiOperationObject = {
  operationId: "deleteRole",
  summary: "Delete a role by ID",
  description:
    "Deletes a specific role from the system. Ensure the provided role ID exists. Deleting a role will remove it from all associated roles and users, potentially affecting access controls.",
  requestParams: { path: rolePathParamSchema },
  responses: {
    "204": {
      description: "Role deleted",
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
            message: "Role not found.",
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
