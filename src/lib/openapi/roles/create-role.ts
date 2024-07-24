import { ZodOpenApiOperationObject } from "zod-openapi"

import { roleCreateSchema, roleOutputSchema } from "@/schemas/roles"

import {
  conflictErrorSchema,
  internalServerErrorSchema,
  notFoundErrorSchema,
  unauthorizedErrorSchema,
  validationErrorSchema,
} from "../responses"

export const createRole: ZodOpenApiOperationObject = {
  operationId: "createRole",
  summary: "Create a role",
  description: "Create a new role in the system.",
  requestBody: {
    content: {
      "application/json": {
        schema: roleCreateSchema,
      },
    },
  },
  responses: {
    "201": {
      description: "Role created",
      content: { "application/json": { schema: roleOutputSchema } },
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
              value: { message: "One or more Permissions not found." },
            },
            toolsNotFound: {
              summary: "Tools not found",
              value: { message: "One or more Tools not found." },
            },
          },
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
              value: { message: "A role with that name already exists." },
            },
            keyConflict: {
              summary: "Key conflict",
              value: { message: "A role with that key already exists." },
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
  tags: ["Roles"],
  security: [{ BearerAuth: [] }],
}
