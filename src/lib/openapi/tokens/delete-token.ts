import { ZodOpenApiOperationObject } from "zod-openapi"

import "@/schemas/tokens"
import { tokenPathParamSchema } from "@/schemas/tokens"

import {
  badRequestErrorSchema,
  internalServerErrorSchema,
  notFoundErrorSchema,
  unauthorizedErrorSchema,
} from "../responses"

export const deleteToken: ZodOpenApiOperationObject = {
  operationId: "deleteToken",
  summary: "Delete a token by ID",
  description:
    "Deletes a specific token from the system. Ensure the provided token ID exists. Deleting a token will remove it from all associated tokens and users, potentially affecting access controls.",
  requestParams: { path: tokenPathParamSchema },
  responses: {
    "204": {
      description: "Token deleted",
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
            message: "Token not found.",
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
  tags: ["Tokens"],
  security: [{ BearerAuth: [] }],
}
