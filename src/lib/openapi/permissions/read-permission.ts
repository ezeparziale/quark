import { ZodOpenApiOperationObject } from "zod-openapi"

import {
  permissionOutputSchema,
  permissionPathParamSchema,
} from "@/schemas/permissions"

import {
  badRequestErrorSchema,
  internalServerErrorSchema,
  notFoundErrorSchema,
  unauthorizedErrorSchema,
} from "../responses"

export const readPermission: ZodOpenApiOperationObject = {
  operationId: "readPermission",
  summary: "Read a permission by ID",
  description: "Retrieve details of a specific permission using its ID.",
  requestParams: { path: permissionPathParamSchema },
  responses: {
    "200": {
      description: "Read Permission",
      content: { "application/json": { schema: permissionOutputSchema } },
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
