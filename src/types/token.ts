export interface Token {
  id: string
  name: string
  partialToken: string
  expires: string | null
  lastUsed: string
  userId: number
  createdAt: string
  updatedAt: string
  type: "inherit" | "custom"
  isActive: boolean
  permissionIds: number[] | null
  permissions: Array<{
    id: number
    name: string
  }> | null
}

export interface TokensResponse {
  data: Token[]
  totalCount: number
  totalCountFiltered: number
  pageCount: number
}

export interface TableParams {
  page: number
  limit: number
  search: string
  sort: string
}
