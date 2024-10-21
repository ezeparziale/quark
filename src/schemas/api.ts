import * as z from "zod"
import "zod-openapi/extend"

const DEFAULT_PAGE: number = 1
const DEFAULT_LIMIT: number = 10
const MIN_LIMIT: number = 1
const MAX_LIMIT: number = 100

export const listQuerySchema = z.object({
  page: z.coerce
    .number()
    .min(DEFAULT_PAGE, `The page must be at least ${DEFAULT_PAGE}.`)
    .default(DEFAULT_PAGE)
    .describe("Page number for pagination.")
    .openapi({
      default: DEFAULT_PAGE,
      type: "integer",
    }),
  limit: z.coerce
    .number()
    .min(MIN_LIMIT, `The limit must be at least ${MIN_LIMIT}.`)
    .max(MAX_LIMIT, `The limit must be at most ${MAX_LIMIT}.`)
    .default(DEFAULT_LIMIT)
    .describe("Number of items per page for pagination.")
    .openapi({
      default: DEFAULT_LIMIT,
      type: "integer",
      maximum: MAX_LIMIT,
      minimum: MIN_LIMIT,
      title: "Limit",
    }),
  q: z
    .string()
    .optional()
    .transform((val) => val?.trim() || undefined)
    .describe("Search term to filter results based on various fields."),
  sort: z
    .string()
    .optional()
    .transform((val) => val?.trim() || undefined)
    .describe(
      "Sort order for the results. Use comma-separated fields with optional '-' for descending order. Example: 'name,-createdAt'.",
    )
    .openapi({
      param: {
        examples: {
          default: {
            summary: "Default sort",
            description:
              "Applies no specific sort order.Results will be returned in the order they were originally retrieved or stored.",
            value: "",
          },
          asc: {
            summary: "Ascending order",
            description:
              "Sorts the results in ascending order based on the specified field.",
            value: "id",
          },
          desc: {
            summary: "Descending order",
            description:
              "Sorts the results in descending order based on the specified field.The symbol '-' is used before the field name to indicate descending order.",
            value: "-id",
          },
          "multiple fields": {
            summary: "Multiple fields sorting",
            description:
              "Sorts the results based on multiple fields.Separate field names by commas, and use '-' before a field name to specify descending order for that field.",
            value: "field_1,-field_2",
          },
        },
      },
    }),
})
