import { ITool } from "@/types/types"
import useSWR from "swr"

import { fetcher } from "./fetcher"

export default function useTools() {
  const { data, error, isLoading } = useSWR<ITool[]>("/api/tools", fetcher)

  return { tools: data || [], error, isLoading }
}
