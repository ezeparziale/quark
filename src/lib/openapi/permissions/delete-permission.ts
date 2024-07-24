import { ZodOpenApiOperationObject } from "zod-openapi"

import { permissionPathParamSchema } from "@/schemas/permissions"

import {
  badRequestErrorSchema,
  internalServerErrorSchema,
  notFoundErrorSchema,
  unauthorizedErrorSchema,
} from "../responses"

export const deletePermission: ZodOpenApiOperationObject = {
  operationId: "deletePermission",
  summary: "Delete a permission by ID",
  description:
    "Deletes a specific permission from the system. Ensure the provided permission ID exists. Deleting a permission will remove it from all associated roles and users, potentially affecting access controls.",
  requestParams: { path: permissionPathParamSchema },
  responses: {
    "204": {
      description: "Permission deleted",
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
            message: "Permission not found.",
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
  tags: ["Permissions"],
  security: [{ BearerAuth: [] }],
}
