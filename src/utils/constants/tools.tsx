import { ITools } from "@/types/types"
import { NotebookPen, ShieldCheck } from "lucide-react"

export const TOOLS: ITools[] = [
  {
    label: "Blog",
    value: "blog",
    href: "/tools/blog",
    icon: <NotebookPen className="mr-2 size-4" />,
  },
  {
    label: "Admin",
    value: "admin",
    href: "/admin",
    icon: <ShieldCheck className="mr-2 size-4" />,
  },
]
