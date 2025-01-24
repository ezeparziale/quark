import Link from "next/link"

import React from "react"

import { ChevronLeft } from "lucide-react"

import { Button } from "./ui/button"

export default function BackLinkButton({ link }: { link: string }) {
  return (
    <Button size="sm" variant="link" className="text-muted-foreground mt-1 p-0" asChild>
      <Link href={link}>
        <ChevronLeft className="size-4" />
        <span className="text-sm">Back</span>
      </Link>
    </Button>
  )
}
