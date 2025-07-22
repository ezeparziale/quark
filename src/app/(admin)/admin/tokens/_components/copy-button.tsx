"use client"

import { useState } from "react"

import { Check, Copy } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

interface CopyButtonProps {
  textToCopy: string
  successMessage?: string
  label?: string
}

export function CopyButton({
  textToCopy,
  successMessage = "Copied!",
  label = "Copy",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      toast.info(successMessage || "Text copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error("Failed to copy text.")
      console.error("Failed to copy text:", error)
    }
  }

  return (
    <Button
      type="button"
      size="sm"
      className="px-3"
      onClick={handleCopy}
      variant="secondary"
    >
      <span className="sr-only">{label}</span>
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </Button>
  )
}
