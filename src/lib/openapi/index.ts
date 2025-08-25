import { env } from "@/env"
import { createDocument } from "zod-openapi"

import {
  permissionCreateSchema,
  permissionOutputSchema,
  permissionUpdatePartialSchema,
  permissionUpdateSchema,
} from "@/schemas/permissions"
import {
  roleCreateSchema,
  roleOutputSchema,
  roleUpdatePartialSchema,
  roleUpdateSchema,
} from "@/schemas/roles"
import {
  tokenCreateSchema,
  tokenOutputSchema,
  tokenUpdatePartialSchema,
  tokenUpdateSchema,
} from "@/schemas/tokens"
import {
  userCreateSchema,
  userOutputSchema,
  userUpdatePartialSchema,
  userUpdateSchema,
} from "@/schemas/users"

import { permissionsPaths } from "./permissions"
import { rolesPaths } from "./roles"
import { tokensPaths } from "./tokens"
import { usersPaths } from "./users"

export const document = createDocument({
  openapi: "3.1.0",
  info: {
    title: "Quark API",
    description: `[/api/v1/openapi](${env.AUTH_URL}/api/openapi)\n\nQuark API 🚀\n\n`,
    version: "0.0.1",
    contact: { name: "@ezeparziale" },
  },
  servers: [
    {
      url: env.AUTH_URL,
      description: "Production API",
    },
  ],
  paths: {
    ...permissionsPaths,
    ...rolesPaths,
    ...usersPaths,
    ...tokensPaths,
  },
  components: {
    schemas: {
      permissionOutputSchema,
      permissionCreateSchema,
      permissionUpdatePartialSchema,
      permissionUpdateSchema,
      roleOutputSchema,
      roleCreateSchema,
      roleUpdateSchema,
      roleUpdatePartialSchema,
      userOutputSchema,
      userCreateSchema,
      userUpdatePartialSchema,
      userUpdateSchema,
      tokenOutputSchema,
      tokenCreateSchema,
      tokenUpdateSchema,
      tokenUpdatePartialSchema,
    },
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [{ BearerAuth: [] }],
})
