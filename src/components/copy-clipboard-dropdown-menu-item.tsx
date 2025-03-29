"use client"

import { Copy } from "lucide-react"
import { toast } from "sonner"

import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard"

import { DropdownMenuItem } from "./ui/dropdown-menu"

interface IProps extends React.ComponentProps<"div"> {
  textToCopy: string
  label?: string
  successMessage?: string
}

export function CopyClipboardDropdownMenuItem({
  textToCopy,
  label = "Copy ID",
  successMessage = "Copied to clipboard!",
}: IProps) {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 })

  const onCopy = () => {
    if (isCopied) return

    try {
      copyToClipboard(textToCopy)
      toast.info(successMessage)
    } catch {
      toast.error("Failed to copy. Please try again.")
    }
  }

  return (
    <DropdownMenuItem onClick={() => onCopy()}>
      <Copy className="size-4" />
      {label}
    </DropdownMenuItem>
  )
}
