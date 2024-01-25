import { cn } from "@/lib/utils"

import BackLinkButton from "./back-link-button"
import { CopyButtonData } from "./copy-clipboard-button"
import { Separator } from "./ui/separator"

interface PageHeaderContentProps {
  title: string
  description: string
  copy?: string
}

function PageHeaderContent({ title, description, copy }: PageHeaderContentProps) {
  return (
    <div className="space-y-0.5">
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      <div className="flex items-center justify-start">
        <p className="text-muted-foreground">{description}</p>
        {copy && <CopyButtonData textToCopy={copy} />}
      </div>
    </div>
  )
}

function PageSectionContent({ title, description }: PageHeaderContentProps) {
  return (
    <div>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

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
        <PageHeaderContent title={title} description={description} copy={copy} />
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
          <PageSectionContent title={title} description={description} />
          {action}
        </div>
        <Separator />
      </div>
    </>
  )
}
