import { type ClassValue, clsx } from "clsx"
import { formatDistanceToNow } from "date-fns"
import { format, formatInTimeZone, toZonedTime } from "date-fns-tz"
import { LayoutGrid } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import * as LucideIcons from "lucide-react"
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

export const formatDate = (date: Date) => {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const localDate = toZonedTime(date, userTimeZone)

  const utcDateTime = formatInTimeZone(
    new Date(date.toISOString()),
    "UTC",
    "MMMM d, yyyy HH:mm:ss",
  )

  const localDateTime = format(localDate, "MMMM d, yyyy HH:mm:ss", {
    timeZone: userTimeZone,
  })

  const gmtOffset = format(localDate, "zzz", {
    timeZone: userTimeZone,
  })

  return {
    timeAgo: formatDistanceToNow(date, { addSuffix: true }),
    utcDateTime,
    localDateTime,
    localTimeZone: gmtOffset,
  }
}

export const getIconComponent = (iconName: string): LucideIcon => {
  const normalizedName = iconName
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("")

  return (
    (LucideIcons as unknown as Record<string, LucideIcon>)[normalizedName] || LayoutGrid
  )
}

export function diffArrays<T extends string | number>(oldIds: T[], newIds: T[]) {
  const toDelete = oldIds.filter((id) => !newIds.includes(id))
  const toAdd = newIds.filter((id) => !oldIds.includes(id))
  const toKeep = oldIds.filter((id) => newIds.includes(id))

  return {
    toDelete,
    toAdd,
    toKeep,
  }
}
