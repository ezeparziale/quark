import { ZodOpenApiOperationObject } from "zod-openapi"

import {
  tokenOutputSchema,
  tokenPathParamSchema,
  tokenUpdatePartialSchema,
  tokenUpdateSchema,
} from "@/schemas/tokens"

import {
  badRequestErrorSchema,
  internalServerErrorSchema,
  notFoundErrorSchema,
  unauthorizedErrorSchema,
  validationErrorSchema,
} from "../responses"

export const updateToken: ZodOpenApiOperationObject = {
  operationId: "updateToken",
  summary: "Update a token by ID",
  description: "Update the details of an existing token.",
  requestParams: { path: tokenPathParamSchema },
  requestBody: {
    content: {
      "application/json": {
        schema: tokenUpdateSchema,
      },
    },
  },
  responses: {
    "200": {
      description: "Token updated",
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
          examples: {
            tokenNotFound: {
              summary: "Token not found",
              value: { message: "Token not found." },
            },
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

export const updatePartialToken: ZodOpenApiOperationObject = {
  operationId: "updatePartialToken",
  summary: "Partially update a token by ID",
  description: "Partially update the details of an existing token.",
  requestParams: { path: tokenPathParamSchema },
  requestBody: {
    content: {
      "application/json": {
        schema: tokenUpdatePartialSchema,
      },
    },
  },
  responses: {
    "200": {
      description: "Token updated",
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
          examples: {
            tokenNotFound: {
              summary: "Token not found",
              value: { message: "Token not found." },
            },
            permissionsNotFound: {
              summary: "Permissions not found",
              value: { message: "One or more Permissions not found." },
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
