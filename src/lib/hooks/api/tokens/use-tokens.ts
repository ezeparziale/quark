"use client"

import { useCallback, useEffect, useState } from "react"

import { TableParams, Token } from "@/types/token"

export function useTokens(params: TableParams) {
  const [data, setData] = useState<Token[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [totalCountFiltered, setTotalCountFiltered] = useState(0)
  const [pageCount, setPageCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTokens = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const searchParams = new URLSearchParams()
      searchParams.set("page", params.page.toString())
      searchParams.set("limit", params.limit.toString())

      if (params.search) {
        searchParams.set("q", params.search)
      }

      if (params.sort) {
        searchParams.set("sort", params.sort)
      }

      const response = await fetch(`/api/v1/tokens?${searchParams.toString()}`)

      if (!response.ok) {
        throw new Error("Failed to fetch tokens")
      }

      const tokens = await response.json()
      const totalCount = Number.parseInt(response.headers.get("total-count") || "0")
      const totalCountFiltered = Number.parseInt(
        response.headers.get("total-count-filtered") || "0",
      )
      const pageCount = Number.parseInt(response.headers.get("pagination-pages") || "0")

      setData(tokens)
      setTotalCount(totalCount)
      setTotalCountFiltered(totalCountFiltered)
      setPageCount(pageCount)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }, [params])

  useEffect(() => {
    fetchTokens()
  }, [fetchTokens])

  return {
    data,
    totalCount,
    totalCountFiltered,
    pageCount,
    loading,
    error,
    refetch: fetchTokens,
  }
}
