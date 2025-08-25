import { ZodOpenApiOperationObject } from "zod-openapi"

import { tokenOutputSchema, tokenPathParamSchema } from "@/schemas/tokens"

import {
  badRequestErrorSchema,
  internalServerErrorSchema,
  notFoundErrorSchema,
  unauthorizedErrorSchema,
} from "../responses"

export const readToken: ZodOpenApiOperationObject = {
  operationId: "readToken",
  summary: "Read a token by ID",
  description: "Retrieve details of a specific token using its ID.",
  requestParams: { path: tokenPathParamSchema },
  responses: {
    "200": {
      description: "Read Token",
      content: { "application/json": { schema: tokenOutputSchema } },
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
            message: "Token not found",
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
