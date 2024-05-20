import * as z from "zod"

const emailFieldSchema = z
  .string({ required_error: "Email is required" })
  .email({ message: "Invalid email address" })

const usernameFieldSchema = z
  .string({ required_error: "Username is required" })
  .trim()
  .min(1, { message: "Username is required" })
  .max(60, { message: "Username must not exceed 60 characters" })

const basicPasswordFieldSchema = z.string({ required_error: "Password is required" })

const passwordFieldSchema = basicPasswordFieldSchema
  .min(8, "Password must be at least 8 characters")
  .max(60, "Password must not exceed 60 characters")

const confirmPasswordFieldSchema = z.string({
  required_error: "Please confirm your password",
})

const passwordMatchValidation = (
  data: { password: string; confirmPassword: string },
  context: z.RefinementCtx,
) => {
  if (data.password !== data.confirmPassword) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Passwords don't match",
      path: ["confirmPassword"],
    })
  }
}

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
  .superRefine(passwordMatchValidation)

export const resetPasswordRequestSchema = z.object({
  email: emailFieldSchema,
})

export const resetPasswordSchema = z
  .object({
    password: passwordFieldSchema,
    confirmPassword: confirmPasswordFieldSchema,
  })
  .superRefine(passwordMatchValidation)

export const confirmEmailRequestSchema = z.object({
  email: emailFieldSchema,
})
