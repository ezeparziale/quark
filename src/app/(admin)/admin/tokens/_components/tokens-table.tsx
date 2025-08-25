"use client"

import { useState } from "react"

import type { TableParams } from "@/types/token"

import { useTokens } from "@/lib/hooks/api/tokens/use-tokens"
import { useUrlParams } from "@/lib/hooks/use-url-params"

import { DataTable } from "@/components/ui/data-tables/server-side/data-table"

import { columns } from "./columns"
import { CreateTokenDialog } from "./create-token-dialog"

export default function TokensTable() {
  const { getParamsFromUrl, updateUrl } = useUrlParams()

  const [params, setParams] = useState<TableParams>(() => getParamsFromUrl())
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { data, totalCount, totalCountFiltered, pageCount, loading, error } =
    useTokens(params)

  const handleCreateNew = () => {
    setIsDialogOpen(true)
  }

  const handleParamsChange = (newParams: TableParams) => {
    setParams(newParams)
    updateUrl(newParams)
  }

  if (error) {
    return <div className="text-center text-red-500">Error loading tokens: {error}</div>
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        totalCount={totalCount}
        totalCountFiltered={totalCountFiltered}
        pageCount={pageCount}
        loading={loading}
        params={params}
        onParamsChange={handleParamsChange}
        searchPlaceholder="Search tokens..."
        defaultHiddenColumns={{ createdAt: false }}
        enableSearch={true}
        enableColumnToggle={true}
        emptyStateTitle="No tokens found"
        emptyStateDescription="Create your first API token to get started with authentication."
        onCreateNew={handleCreateNew}
        createButtonText="Create Token"
      />
      <CreateTokenDialog isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} />
    </>
  )
}
