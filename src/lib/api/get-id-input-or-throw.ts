import { ApiError } from "./api-error"

export const getIdInputOrThrow = (idString: string) => {
  const id = parseInt(idString)

  if (isNaN(id)) {
    throw new ApiError({
      message: "Invalid ID supplied",
      code: 400,
    })
  }

  return id
}
