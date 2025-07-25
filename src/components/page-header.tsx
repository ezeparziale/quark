import { cn } from "@/lib/utils"

import BackLinkButton from "./back-link-button"
import { CopyButtonData } from "./copy-clipboard-button"
import { Separator } from "./ui/separator"
import { Skeleton } from "./ui/skeleton"

interface PageHeaderProps {
  title: string
  titleExtras?: React.ReactNode[]
  description?: string
  descriptionExtras?: React.ReactNode[]
  actions?: React.ReactNode | React.ReactNode[]
  linkBack?: string
  copy?: string
  copyLabel?: string
  copySuccessMessage?: string
}

export function PageHeader({
  title,
  titleExtras,
  description,
  descriptionExtras,
  actions,
  linkBack,
  copy,
  copyLabel,
  copySuccessMessage,
}: PageHeaderProps) {
  return (
    <header className={cn("mb-6", linkBack ? "mt-4" : "mt-14")}>
      {linkBack && <BackLinkButton link={linkBack} />}
      <div className="flex flex-row flex-wrap items-center justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
            {titleExtras &&
              titleExtras.map((extra, index) => <div key={index}>{extra}</div>)}
          </div>
          <div className="flex items-center gap-2">
            {description && (
              <p
                className="text-muted-foreground text-sm md:text-base"
                aria-label={description}
              >
                {description}
              </p>
            )}
            {copy && (
              <CopyButtonData
                textToCopy={copy}
                label={copyLabel}
                successMessage={copySuccessMessage}
              />
            )}
            {descriptionExtras &&
              descriptionExtras.map((extra, index) => <div key={index}>{extra}</div>)}
          </div>
        </div>
        {actions && (
          <div
            className="flex flex-wrap items-center justify-start gap-2 sm:justify-end"
            role="toolbar"
            aria-label="Page actions"
          >
            {actions}
          </div>
        )}
      </div>
      <Separator className="mt-6" decorative />
    </header>
  )
}

export function PageHeaderSkeleton() {
  return (
    <header className="mt-14 mb-6" aria-busy="true" aria-label="Loading page header">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:space-x-4">
        <div className="space-y-1">
          <Skeleton className="mb-3 h-9 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
      </div>
      <Separator className="my-6" decorative />
    </header>
  )
}

PageHeader.Skeleton = PageHeaderSkeleton

interface PageSectionProps {
  title: string
  description: string
  actions?: React.ReactNode | React.ReactNode[]
}

export function PageSection({ title, description, actions }: PageSectionProps) {
  return (
    <section className="mb-6 space-y-6">
      <div className="flex flex-row flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-medium">{title}</h2>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
        {actions && (
          <div
            className="flex flex-wrap items-center justify-start gap-2 sm:justify-end"
            role="toolbar"
            aria-label="Page section actions"
          >
            {actions}
          </div>
        )}
      </div>
      <Separator decorative />
    </section>
  )
}

export function PageSectionSkeleton() {
  return (
    <section
      className="mb-6 space-y-6"
      aria-busy="true"
      aria-label="Loading page section"
    >
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-6 w-64" />
          <Skeleton className="mt-2 h-4 w-96" />
        </div>
      </div>
      <Separator decorative />
    </section>
  )
}

PageSection.Skeleton = PageSectionSkeleton
