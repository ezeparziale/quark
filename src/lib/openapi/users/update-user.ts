import { ZodOpenApiOperationObject } from "zod-openapi"

import {
  userOutputSchema,
  userPathParamSchema,
  userUpdatePartialSchema,
  userUpdateSchema,
} from "@/schemas/users"

import {
  badRequestErrorSchema,
  conflictErrorSchema,
  internalServerErrorSchema,
  unauthorizedErrorSchema,
  validationErrorSchema,
} from "../responses"

export const updateUser: ZodOpenApiOperationObject = {
  operationId: "updateUser",
  summary: "Update a user by ID",
  description:
    "Update the details of an existing user. This operation allows for updating all the fields of the user.",
  requestParams: { path: userPathParamSchema },
  requestBody: {
    content: {
      "application/json": {
        schema: userUpdateSchema,
      },
    },
  },
  responses: {
    "200": {
      description: "User updated",
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

export const updatePartialUser: ZodOpenApiOperationObject = {
  operationId: "updatePartialUser",
  summary: "Partially update a user by ID",
  description:
    "Partially update the details of an existing user. This operation allows for updating one or more fields of the user without requiring all fields to be provided, enabling more flexible updates.",
  requestParams: { path: userPathParamSchema },
  requestBody: {
    content: {
      "application/json": {
        schema: userUpdatePartialSchema,
      },
    },
  },
  responses: {
    "200": {
      description: "User updated",
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
