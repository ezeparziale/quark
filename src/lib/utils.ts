import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function addServerErrors<T>(
  errors: { [P in keyof T]?: string[] },
  setError: (fieldName: keyof T, error: { type: string; message: string }) => void,
) {
  return Object.keys(errors).forEach((key) => {
    const errorMessages = errors[key as keyof T]
    if (errorMessages && errorMessages.length > 0) {
      setError(key as keyof T, {
        type: "server",
        message: errors[key as keyof T]!.join(". "),
      })
    }
  })
}

export async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const getSearchParams = (url: string) => {
  const params = {} as Record<string, string>

  new URL(url).searchParams.forEach(function (val, key) {
    params[key] = val
  })

  return params
}
