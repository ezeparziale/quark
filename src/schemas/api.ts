import * as z from "zod"
import "zod-openapi/extend"

const DEFAULT_PAGE: number = 1
const DEFAULT_LIMIT: number = 10
const MAX_LIMIT: number = 100

export const listQuerySchema = z.object({
  page: z
    .string()
    .transform((val) => {
      const num = parseInt(val, 10)
      if (Number.isNaN(num) || num < 1) {
        return DEFAULT_PAGE
      }
      return num
    })
    .default(String(DEFAULT_PAGE))
    .describe("Page number for pagination.")
    .openapi({
      example: "1",
    }),
  limit: z
    .string()
    .transform((val) => {
      const num = parseInt(val, 10)
      if (Number.isNaN(num) || num < 1) {
        return DEFAULT_LIMIT
      }
      return Math.min(num, MAX_LIMIT)
    })
    .default(String(DEFAULT_LIMIT))
    .describe("Number of items per page for pagination.")
    .openapi({
      example: "10",
    }),
  q: z
    .string()
    .optional()
    .transform((val) => val?.trim() || undefined)
    .describe("Search term to filter results based on various fields.")
    .openapi({
      example: "searchTerm",
    }),
  sort: z
    .string()
    .optional()
    .transform((val) => val?.trim() || undefined)
    .describe(
      "Sort order for the results. Use comma-separated fields with optional '-' for descending order. Example: 'name,-createdAt'.",
    )
    .openapi({
      example: "name,-createdAt",
    }),
})
