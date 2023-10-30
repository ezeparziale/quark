import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CardKPILoading() {
  return (
    <Card>
      <div className="animate-pulse">
        <CardHeader className="flex flex-row items-center justify-between space-x-2 space-y-0 pb-2">
          <CardTitle className="h-4 w-2/3 rounded bg-slate-700"></CardTitle>
          <div className="h-6 w-6 rounded bg-slate-700"></div>
        </CardHeader>
        <CardContent>
          <div className="h-6 w-20 rounded bg-slate-700 text-2xl font-bold"></div>
          <p className="mt-3 h-2 w-20 rounded bg-slate-700 text-xs text-muted-foreground"></p>
        </CardContent>
      </div>
    </Card>
  )
}
