import * as z from "zod"
import "zod-openapi/extend"

// 400
export const badRequestErrorSchema = z.object({
  message: z
    .string()
    .describe("Error message indicating that the request was invalid or malformed")
    .openapi({
      example: "Bad Request",
    }),
})

// 401
export const unauthorizedErrorSchema = z.object({
  message: z.string().describe("Error message for unauthorized access").openapi({
    example: "Unauthorized",
  }),
})

// 404
export const notFoundErrorSchema = z.object({
  message: z
    .string()
    .describe("Error message indicating that the resource was not found")
    .openapi({
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
    errors: z.record(z.array(z.string())).describe("Validation errors for fields"),
  })
  .openapi({
    example: {
      errors: {
        fieldName1: ["Error message 1"],
        fieldName2: ["Error message 2", "Another error message"],
      },
    },
  })

// 500
export const internalServerErrorSchema = z.object({
  message: z.string().describe("Internal server error message").openapi({
    example: "Internal Server Error",
  }),
})
