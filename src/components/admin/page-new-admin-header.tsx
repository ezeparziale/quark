import BackButtonLink from "@/components/back-button-link"
import { Separator } from "@/components/ui/separator"

interface IProps {
  children: React.ReactNode
  title: string
  description: string
  linkBack: string
}

export default function PageNewAdminHeader({
  children,
  title,
  description,
  linkBack,
}: IProps) {
  return (
    <>
      <BackButtonLink link={linkBack} />
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <div className="flex items-center justify-start">
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>
      </div>
      <Separator className="my-6" />
      {children}
    </>
  )
}
