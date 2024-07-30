import { FilePlus, LucideIcon } from "lucide-react"

type Props = {
  title?: string
  description?: string
  action?: React.ReactNode
  icon?: LucideIcon
}

export default function EmptyState({
  title = "No data available",
  description = "You can add new data to get started",
  action,
  icon = FilePlus,
}: Props) {
  const Icon = icon
  return (
    <div className="flex flex-1 flex-col items-center space-y-3 text-center">
      <div className="flex items-center justify-center h-16 w-16 rounded-md bg-accent">
        <Icon className="size-8 text-muted-foreground md:size-10" />
      </div>
      <div>
        <h3 className="text-xl font-bold tracking-tight md:text-2xl">{title}</h3>
        <p className="text-xs text-muted-foreground md:text-sm">{description}</p>
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  )
}
