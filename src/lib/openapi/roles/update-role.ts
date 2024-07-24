import { ZodOpenApiOperationObject } from "zod-openapi"

import {
  roleOutputSchema,
  rolePathParamSchema,
  roleUpdatePartialSchema,
  roleUpdateSchema,
} from "@/schemas/roles"

import {
  badRequestErrorSchema,
  conflictErrorSchema,
  internalServerErrorSchema,
  notFoundErrorSchema,
  unauthorizedErrorSchema,
  validationErrorSchema,
} from "../responses"

export const updateRole: ZodOpenApiOperationObject = {
  operationId: "updateRole",
  summary: "Update a role by ID",
  description:
    "Update the details of an existing role. This operation allows for updating all the fields of the role, ensuring that the role's name, key, and description are consistent and up-to-date.",
  requestParams: { path: rolePathParamSchema },
  requestBody: {
    content: {
      "application/json": {
        schema: roleUpdateSchema,
      },
    },
  },
  responses: {
    "200": {
      description: "Role updated",
      content: { "application/json": { schema: roleOutputSchema } },
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
            roleNotFound: {
              summary: "Role not found",
              value: { message: "Role not found." },
            },
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

export const updatePartialRole: ZodOpenApiOperationObject = {
  operationId: "updatePartialRole",
  summary: "Partially update a role by ID",
  description:
    "Partially update the details of an existing role. This operation allows for updating one or more fields of the role without requiring all fields to be provided, enabling more flexible updates.",
  requestParams: { path: rolePathParamSchema },
  requestBody: {
    content: {
      "application/json": {
        schema: roleUpdatePartialSchema,
      },
    },
  },
  responses: {
    "200": {
      description: "Role updated",
      content: { "application/json": { schema: roleOutputSchema } },
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
            roleNotFound: {
              summary: "Role not found",
              value: { message: "Role not found." },
            },
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
