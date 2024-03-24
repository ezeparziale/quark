import { cn } from "@/lib/utils"

import BackLinkButton from "./back-link-button"
import { CopyButtonData } from "./copy-clipboard-button"
import { Separator } from "./ui/separator"

interface PageHeaderProps {
  title: string
  description: string
  action?: React.ReactNode
  linkBack?: string
  copy?: string
}

export function PageHeader({
  title,
  description,
  action,
  linkBack,
  copy,
}: PageHeaderProps) {
  return (
    <>
      {linkBack && <BackLinkButton link={linkBack} />}
      <div
        className={cn(
          "flex items-center justify-between space-x-4",
          linkBack ? "mt-4" : "mt-14",
        )}
      >
        <div className="space-y-0.5">
          <h2 className="text-xl font-bold tracking-tight md:text-2xl">{title}</h2>
          <div className="flex items-center justify-start">
            <p className="text-sm text-muted-foreground md:text-base">{description}</p>
            {copy && <CopyButtonData textToCopy={copy} />}
          </div>
        </div>
        {action}
      </div>
      <Separator className="my-6" />
    </>
  )
}

interface PageSectionProps {
  title: string
  description: string
  action?: React.ReactNode
}

export function PageSection({ title, description, action }: PageSectionProps) {
  return (
    <>
      <div className="mb-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          {action}
        </div>
        <Separator />
      </div>
    </>
  )
}
