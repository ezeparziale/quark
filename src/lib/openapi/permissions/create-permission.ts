import { ZodOpenApiOperationObject } from "zod-openapi"

import { permissionCreateSchema, permissionOutputSchema } from "@/schemas/permissions"

import {
  conflictErrorSchema,
  internalServerErrorSchema,
  unauthorizedErrorSchema,
  validationErrorSchema,
} from "../responses"

export const createPermission: ZodOpenApiOperationObject = {
  operationId: "createPermission",
  summary: "Create a permission",
  description: "Create a new permission in the system.",
  requestBody: {
    content: {
      "application/json": {
        schema: permissionCreateSchema,
      },
    },
  },
  responses: {
    "201": {
      description: "Permission created",
      content: { "application/json": { schema: permissionOutputSchema } },
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
