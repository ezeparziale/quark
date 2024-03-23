import { FilePlus } from "lucide-react"

type Props = {
  title?: string
  description?: string
  button?: React.ReactNode
  Icon?: React.ElementType
}

export default function EmptyState({
  title = "No data available",
  description = "You can add new data to get started",
  button,
  Icon = FilePlus,
}: Props) {
  return (
    <div className="my-4 flex flex-1 flex-col items-center gap-1 text-center">
      {Icon && <Icon className="size-8 text-muted-foreground md:size-10" />}
      <h3 className="text-xl font-bold tracking-tight md:text-2xl">{title}</h3>
      <p className="text-xs text-muted-foreground md:text-sm">{description}</p>
      {button}
    </div>
  )
}
