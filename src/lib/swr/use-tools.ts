import { ITools } from "@/types/types"
import useSWR from "swr"

import { fetcher } from "./fetcher"

export default function useTools() {
  const { data, error, isLoading } = useSWR<ITools[]>("/api/tools", fetcher)

  return { tools: data, error, isLoading }
}
