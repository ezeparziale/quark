import * as z from "zod"

// 400
export const badRequestErrorSchema = z.object({
  message: z
    .string()
    .describe("Error message indicating that the request was invalid or malformed")
    .meta({
      example: "Bad Request",
    }),
})

// 401
export const unauthorizedErrorSchema = z.object({
  message: z.string().describe("Error message for unauthorized access").meta({
    example: "Unauthorized",
  }),
})

// 404
export const notFoundErrorSchema = z.object({
  message: z
    .string()
    .describe("Error message indicating that the resource was not found")
    .meta({
      example: "Resource not found",
    }),
})

// 409
export const conflictErrorSchema = z.object({
  message: z.string().describe("Error message"),
})

// 422
export const validationErrorSchema = z
  .object({
    errors: z.record(z.string(), z.string()).describe("Validation errors for fields"),
  })
  .meta({
    example: {
      errors: {
        fieldName1: ["Error message 1"],
        fieldName2: ["Error message 2", "Another error message"],
      },
    },
  })

// 500
export const internalServerErrorSchema = z.object({
  message: z.string().describe("Internal server error message").meta({
    example: "Internal Server Error",
  }),
})
