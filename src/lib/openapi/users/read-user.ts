import { ZodOpenApiOperationObject } from "zod-openapi"

import { userOutputSchema, userPathParamSchema } from "@/schemas/users"

import {
  badRequestErrorSchema,
  internalServerErrorSchema,
  notFoundErrorSchema,
  unauthorizedErrorSchema,
} from "../responses"

export const readUser: ZodOpenApiOperationObject = {
  operationId: "readUser",
  summary: "Read a user by ID",
  description: "Retrieve details of a specific user using its ID.",
  requestParams: { path: userPathParamSchema },
  responses: {
    "200": {
      description: "Read User",
      content: { "application/json": { schema: userOutputSchema } },
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
