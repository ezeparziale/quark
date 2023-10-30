export type DataResult<T> = {
  success: boolean
  errors?: { [P in keyof T]?: string[] }
  message?: String
}
