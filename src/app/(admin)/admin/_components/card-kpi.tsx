import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface IProps {
  title: string
  Icon: React.ElementType
  kpi: number
  extra?: string
}

export default function CardKpi({ title, Icon, kpi, extra }: IProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{kpi}</div>
        {extra && <p className="text-xs text-muted-foreground">{extra}</p>}
      </CardContent>
    </Card>
  )
}
