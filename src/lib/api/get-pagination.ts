import { listQuerySchema } from "@/schemas/api"

export const getPagination = (searchParams: Record<string, string>) => {
  const parsedParams = listQuerySchema.parse(searchParams)
  const { page, limit, q: search, sort } = parsedParams

  const offset = (page - 1) * limit

  return { page, limit, offset, search, sort }
}
