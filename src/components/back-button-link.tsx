import Link from "next/link"

import React from "react"

import { ArrowLeft } from "lucide-react"

import { Button } from "./ui/button"

export default function BackButtonLink({ link }: { link: string }) {
  return (
    <Button size="sm" variant="link" className="mb-6 p-0" asChild>
      <Link href={link}>
        <ArrowLeft className="h-4 w-4" />
        <span className="text-sm">Back</span>
      </Link>
    </Button>
  )
}
