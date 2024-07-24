export class ApiError extends Error {
  public readonly code
  constructor({ message, code }: { message: string; code: number }) {
    super(message)
    this.code = code
  }
}
