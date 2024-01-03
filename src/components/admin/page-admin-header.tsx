import Link from "next/link"

import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface IActionDetails {
  actionHrefLink: string
  actionLabelSrOnly: string
  actionLabel: string
}

interface IActionProps {
  action?: IActionDetails
}

interface IProps {
  children: React.ReactNode
  title: string
  description: string
  action?: IActionProps
}

export default function PageAdminHeader({
  children,
  title,
  description,
  action,
}: IProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h3 className="text-lg font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <ActionButton action={action?.action} />
      </div>
      <Separator />
      {children}
    </div>
  )
}

function ActionButton({ action }: IActionProps) {
  if (!action) return null

  const { actionHrefLink, actionLabelSrOnly, actionLabel } = action

  return (
    <Button size="sm" asChild>
      <Link href={actionHrefLink}>
        <Plus className="h-4 w-4" />
        <span className="sr-only">{actionLabelSrOnly}</span>
        <span className="ml-2 hidden md:block">{actionLabel}</span>
      </Link>
    </Button>
  )
}
