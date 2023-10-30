"use client"

import React from "react"

import { Copy } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function CopyIdButton({ id }: { id: string }) {
  return (
    <Button
      variant="secondary"
      className="mx-2 h-6 w-6 p-0"
      onClick={() => {
        navigator.clipboard.writeText(id)
      }}
    >
      <Copy className="h-3 w-3" />
    </Button>
  )
}
