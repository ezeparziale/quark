"use client"

import { useRouter, useSearchParams } from "next/navigation"

import { useCallback } from "react"

import type { TableParams } from "@/types/token"

export function useUrlParams() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const getParamsFromUrl = useCallback((): TableParams => {
    return {
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 10,
      search: searchParams.get("q") || "",
      sort: searchParams.get("sort") || "",
    }
  }, [searchParams])

  const updateUrl = useCallback(
    (params: TableParams) => {
      const newSearchParams = new URLSearchParams()

      if (params.page > 1) {
        newSearchParams.set("page", params.page.toString())
      }

      newSearchParams.set("limit", params.limit.toString())

      if (params.search) {
        newSearchParams.set("q", params.search)
      }

      if (params.sort) {
        newSearchParams.set("sort", params.sort)
      }

      const newUrl = newSearchParams.toString()
        ? `${window.location.pathname}?${newSearchParams.toString()}`
        : window.location.pathname

      router.replace(newUrl, { scroll: false })
    },
    [router],
  )

  return {
    getParamsFromUrl,
    updateUrl,
  }
}
