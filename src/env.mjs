import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

export const env = createEnv({
  server: {
    // Enviorement
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    // Database
    DATABASE_URL: z.string().url(),
    // Next auth
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production" ? z.string() : z.string().optional(),
    NEXTAUTH_URL: z.string().url(),
    // Auth Google
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    // Email
    MAIL_SERVER: z.string(),
    MAIL_PORT: z.coerce.number().default(587),
    MAIL_USE_TLS: z.coerce.boolean(),
    MAIL_USERNAME: z.string(),
    MAIL_PASSWORD: z.string(),
    // Jwt
    JWT_SECRET_KEY: z.string(),
    JWT_EXPIRED_IN: z.coerce.number().default(300),
  },
  client: {},
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    MAIL_SERVER: process.env.MAIL_SERVER,
    MAIL_PORT: process.env.MAIL_PORT,
    MAIL_USE_TLS: process.env.MAIL_USE_TLS,
    MAIL_USERNAME: process.env.MAIL_USERNAME,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    JWT_EXPIRED_IN: process.env.JWT_EXPIRED_IN,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
})
