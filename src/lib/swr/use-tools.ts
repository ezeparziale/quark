import { ITools } from "@/types/types"
import { TOOLS } from "@/utils"
import useSWR from "swr"

interface SWRError extends Error {
  status: number
}

export async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<JSON> {
  const res = await fetch(input, init)

  if (!res.ok) {
    const error = await res.text()
    const err = new Error(error) as SWRError
    err.status = res.status
    throw err
  }

  return res.json()
}

export default function useTools() {
  const { data, error, isLoading } = useSWR<ITools[]>("/api/tools", fetcher)

  const tools = data?.map((tool) => ({
    ...tool,
    icon: TOOLS.find((filteredTool) => filteredTool.value === tool.value)?.icon,
  }))

  return { tools, error, isLoading }
}
