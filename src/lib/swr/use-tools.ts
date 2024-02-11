import { ITools } from "@/types/types"
import { TOOLS } from "@/utils"
import useSWR from "swr"

import { fetcher } from "./fetcher"

export default function useTools() {
  const { data, error, isLoading } = useSWR<ITools[]>("/api/tools", fetcher)

  const tools = data?.map((tool) => ({
    ...tool,
    icon: TOOLS.find((filteredTool) => filteredTool.value === tool.value)?.icon,
  }))

  return { tools, error, isLoading }
}
