import useSWR from "swr"

import { ITool } from "@/types/types"

import { fetcher } from "./fetcher"

export default function useTools() {
  const { data, error, isLoading } = useSWR<ITool[]>("/api/tools", fetcher)

  return { tools: data || [], error, isLoading }
}
