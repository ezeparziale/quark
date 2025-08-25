import { ZodOpenApiOperationObject } from "zod-openapi"

import { tokenCreateOutputSchema, tokenCreateSchema } from "@/schemas/tokens"

import {
  internalServerErrorSchema,
  notFoundErrorSchema,
  unauthorizedErrorSchema,
  validationErrorSchema,
} from "../responses"

export const createToken: ZodOpenApiOperationObject = {
  operationId: "createToken",
  summary: "Create a token",
  description: "Create a new token in the system.",
  requestBody: {
    content: {
      "application/json": {
        schema: tokenCreateSchema,
      },
    },
  },
  responses: {
    "201": {
      description: "Token created",
      content: { "application/json": { schema: tokenCreateOutputSchema } },
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
          examples: {
            permissionsNotFound: {
              summary: "Permissions not found",
              value: { message: "One or more permissions were not found." },
            },
          },
        },
      },
    },
    "422": {
      description: "Validation Error",
      content: {
        "application/json": {
          schema: validationErrorSchema,
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
