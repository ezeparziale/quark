import BackButtonLink from "./back-button-link"
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
      {linkBack && <BackButtonLink link={linkBack} />}
      <div className="flex items-center justify-between space-x-4">
        <PageHeaderContent title={title} description={description} copy={copy} />
        {action}
      </div>
      <Separator className="my-6" />
    </>
  )
}
