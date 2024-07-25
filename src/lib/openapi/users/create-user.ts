import { ZodOpenApiOperationObject } from "zod-openapi"

import { userCreateSchema, userOutputSchema } from "@/schemas/users"

import {
  conflictErrorSchema,
  internalServerErrorSchema,
  unauthorizedErrorSchema,
  validationErrorSchema,
} from "../responses"

export const createUser: ZodOpenApiOperationObject = {
  operationId: "createUser",
  summary: "Create a user",
  description: "Create a new user in the system.",
  requestBody: {
    content: {
      "application/json": {
        schema: userCreateSchema,
      },
    },
  },
  responses: {
    "201": {
      description: "User created",
      content: { "application/json": { schema: userOutputSchema } },
    },
    "401": {
      description: "Unauthorized Error",
      content: {
        "application/json": {
          schema: unauthorizedErrorSchema,
        },
      },
    },
    "409": {
      description: "Conflict Error",
      content: {
        "application/json": {
          schema: conflictErrorSchema,
          examples: {
            nameConflict: {
              summary: "Email conflict",
              value: { message: "A user with that email already exists." },
            },
            keyConflict: {
              summary: "Username conflict",
              value: { message: "A user with that username already exists." },
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
  tags: ["Users"],
  security: [{ BearerAuth: [] }],
}
