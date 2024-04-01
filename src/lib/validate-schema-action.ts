import { DataResult } from "@/types/types"
import { z } from "zod"

export const validateSchemaAction = <T>(
  schema: z.Schema<T>,
  handler: (formData: T) => Promise<DataResult<T>>,
) => {
  return async (data: T): Promise<DataResult<T>> => {
    const validationResult = schema.safeParse(data)
    if (!validationResult.success) {
      const errorsValidation = validationResult.error.flatten()
        .fieldErrors as DataResult<T>["errors"]
      return { success: false, errors: errorsValidation }
    }
    return handler(data)
  }
}
