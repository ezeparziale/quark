"use client"

import { Check, Copy } from "lucide-react"

import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"

import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

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
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="secondary"
            className="mx-2 h-6 p-1.5"
            onClick={onCopy}
            aria-label={`Copy ${textToCopy}`}
          >
            {isCopied ? <Check className="size-3" /> : <Copy className="size-3" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Copy</TooltipContent>
      </Tooltip>
    </div>
  )
}
