import { ZodOpenApiOperationObject } from "zod-openapi"

import {
  permissionOutputSchema,
  permissionPathParamSchema,
  permissionUpdatePartialSchema,
  permissionUpdateSchema,
} from "@/schemas/permissions"

import {
  badRequestErrorSchema,
  conflictErrorSchema,
  internalServerErrorSchema,
  unauthorizedErrorSchema,
  validationErrorSchema,
} from "../responses"

export const updatePermission: ZodOpenApiOperationObject = {
  operationId: "updatePermission",
  summary: "Update a permission by ID",
  description:
    "Update the details of an existing permission. This operation allows for updating all the fields of the permission, ensuring that the permission's name, key, and description are consistent and up-to-date.",
  requestParams: { path: permissionPathParamSchema },
  requestBody: {
    content: {
      "application/json": {
        schema: permissionUpdateSchema,
      },
    },
  },
  responses: {
    "200": {
      description: "Permission updated",
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
    "409": {
      description: "Conflict Error",
      content: {
        "application/json": {
          schema: conflictErrorSchema,
          examples: {
            nameConflict: {
              summary: "Name conflict",
              value: { message: "A permission with that name already exists." },
            },
            keyConflict: {
              summary: "Key conflict",
              value: { message: "A permission with that key already exists." },
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
  tags: ["Permissions"],
  security: [{ BearerAuth: [] }],
}

export const updatePartialPermission: ZodOpenApiOperationObject = {
  operationId: "updatePartialPermission",
  summary: "Partially update a permission by ID",
  description:
    "Partially update the details of an existing permission. This operation allows for updating one or more fields of the permission without requiring all fields to be provided, enabling more flexible updates.",
  requestParams: { path: permissionPathParamSchema },
  requestBody: {
    content: {
      "application/json": {
        schema: permissionUpdatePartialSchema,
      },
    },
  },
  responses: {
    "200": {
      description: "Permission updated",
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
    "409": {
      description: "Conflict Error",
      content: {
        "application/json": {
          schema: conflictErrorSchema,
          examples: {
            nameConflict: {
              summary: "Name conflict",
              value: { message: "A permission with that name already exists." },
            },
            keyConflict: {
              summary: "Key conflict",
              value: { message: "A permission with that key already exists." },
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
  tags: ["Permissions"],
  security: [{ BearerAuth: [] }],
}
