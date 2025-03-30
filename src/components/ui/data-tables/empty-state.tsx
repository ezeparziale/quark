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
      <div className="bg-accent flex h-16 w-16 items-center justify-center rounded-md">
        <Icon className="text-muted-foreground size-8 md:size-10" />
      </div>
      <div>
        <h3 className="text-xl font-bold tracking-tight md:text-2xl">{title}</h3>
        <p className="text-muted-foreground text-xs md:text-sm">{description}</p>
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  )
}
