export type DataResult<T> = {
  success: boolean
  errors?: { [P in keyof T]?: string[] }
  message?: string
}

export type NavItem = {
  title: string
  href: string
  type: "parent" | "child"
}

export interface ITools {
  id: string
  name: string
  href: string
  icon: string
  isFavorite: boolean
}
