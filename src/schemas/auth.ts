import * as z from "zod"

const emailFieldSchema = z.email({ error: "Invalid email address" })

const usernameFieldSchema = z
  .string({ error: "Username is required" })
  .trim()
  .min(1, { error: "Username is required" })
  .max(60, { error: "Username must not exceed 60 characters" })

const basicPasswordFieldSchema = z.string({ error: "Password is required" })

const passwordFieldSchema = basicPasswordFieldSchema
  .min(8, "Password must be at least 8 characters")
  .max(60, "Password must not exceed 60 characters")

const confirmPasswordFieldSchema = z.string({
  error: "Please confirm your password",
})

export const loginSchema = z.object({
  email: emailFieldSchema,
  password: basicPasswordFieldSchema,
})

export const registerSchema = z
  .object({
    username: usernameFieldSchema,
    email: emailFieldSchema,
    password: passwordFieldSchema,
    confirmPassword: confirmPasswordFieldSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
    when(payload) {
      return registerSchema.safeParse(payload.value).success
    },
  })

export const resetPasswordRequestSchema = z.object({
  email: emailFieldSchema,
})

export const resetPasswordSchema = z
  .object({
    password: passwordFieldSchema,
    confirmPassword: confirmPasswordFieldSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
    when(payload) {
      return registerSchema.safeParse(payload.value).success
    },
  })

export const confirmEmailRequestSchema = z.object({
  email: emailFieldSchema,
})
