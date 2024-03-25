import { cn } from "@/lib/utils"

import BackLinkButton from "./back-link-button"
import { CopyButtonData } from "./copy-clipboard-button"
import { Separator } from "./ui/separator"
import { Skeleton } from "./ui/skeleton"

interface PageHeaderProps {
  title: string
  description: string
  actions?: React.ReactNode | React.ReactNode[]
  linkBack?: string
  copy?: string
}

export function PageHeader({
  title,
  description,
  actions,
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
        {actions ? (
          <div className="flex flex-1 items-center justify-end gap-2">{actions}</div>
        ) : null}
      </div>
      <Separator className="my-6" />
    </>
  )
}

function PageHeaderSkeleton() {
  return (
    <>
      <div className={cn("flex items-center justify-between space-x-4", "mt-14")}>
        <div className="space-y-0.5">
          <Skeleton className="mb-3 h-[24px] w-64" />
          <Skeleton className="h-[22px] w-96" />
        </div>
      </div>
      <Separator className="my-6" />
    </>
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
    <>
      <div className="mb-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          {actions ? (
            <div className="flex flex-1 items-center justify-end gap-2">{actions}</div>
          ) : null}
        </div>
        <Separator />
      </div>
    </>
  )
}

function PageSectionSkeleton() {
  return (
    <div className="space-y-0.5">
      <Skeleton className="my-1 h-[24px] w-64" />
      <Skeleton className="h-[20px] w-96" />
    </div>
  )
}

PageSection.Skeleton = PageSectionSkeleton
