import { ZodOpenApiOperationObject } from "zod-openapi"

import { userPathParamSchema } from "@/schemas/users"

import {
  badRequestErrorSchema,
  internalServerErrorSchema,
  notFoundErrorSchema,
  unauthorizedErrorSchema,
} from "../responses"

export const deleteUser: ZodOpenApiOperationObject = {
  operationId: "deleteUser",
  summary: "Delete a user by ID",
  description:
    "Deletes a specific user from the system. Ensure the provided user ID exists.",
  requestParams: { path: userPathParamSchema },
  responses: {
    "204": {
      description: "User deleted",
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
            message: "User not found.",
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
  tags: ["Users"],
  security: [{ BearerAuth: [] }],
}
