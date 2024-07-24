import { ApiError } from "./api-error"

export const parseRequestBody = async (req: Request) => {
  try {
    return await req.json()
  } catch (e) {
    throw new ApiError({
      message: "Invalid JSON format in request body.",
      code: 400,
    })
  }
}
