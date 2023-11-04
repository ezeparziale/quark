"use client"

import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard"
import { cn } from "@/lib/utils"
import { Check, Copy } from "lucide-react"

import { Button } from "@/components/ui/button"

interface IProps extends React.ComponentProps<"div"> {
  textToCopy: string
}

export function CopyButtonData({ textToCopy, className, ...props }: IProps) {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 })

  const onCopy = () => {
    if (isCopied) return
    copyToClipboard(textToCopy)
  }

  return (
    <div className={cn("flex items-center justify-end", className)} {...props}>
      <Button variant="secondary" className="mx-2 h-6 w-6 p-0" onClick={onCopy}>
        {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        <span className="sr-only">Copy</span>
      </Button>
    </div>
  )
}
