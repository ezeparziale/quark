import { TrendingUpIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface IProps {
  title: string
  Icon: React.ElementType
  kpi: number
  extra?: string
}

export default function CardKpi({ title, Icon, kpi, extra }: IProps) {
  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums">{kpi}</CardTitle>
        <div className="absolute top-4 right-4">
          <Icon />
        </div>
      </CardHeader>
      {extra && (
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <p className="text-muted-foreground text-xs">{extra}</p>
        </CardFooter>
      )}
    </Card>
  )
}
