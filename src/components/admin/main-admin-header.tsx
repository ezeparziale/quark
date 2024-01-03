import Link from "next/link"

import { Plus } from "lucide-react"

import BackButtonLink from "@/components/back-button-link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface IProps {
  children: React.ReactNode
  title: string
  description: string
  actionHrefLink: string
  actionLabelSrOnly: string
}

export default function MainAdminHeader({
  children,
  title,
  description,
  actionHrefLink,
  actionLabelSrOnly,
}: IProps) {
  return (
    <>
      <BackButtonLink link="/admin" />
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <Button asChild>
          <Link href={actionHrefLink}>
            <Plus className="h-4 w-4" />
            <span className="sr-only">{actionLabelSrOnly}</span>
            <span className="ml-2 hidden md:block">Create</span>
          </Link>
        </Button>
      </div>
      <Separator className="my-6" />
      {children}
    </>
  )
}
