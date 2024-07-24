import { env } from "@/env.mjs"
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

import { permissionsPaths } from "./permissions"
import { rolesPaths } from "./roles"

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
  paths: { ...permissionsPaths, ...rolesPaths },
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
