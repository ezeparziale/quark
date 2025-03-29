"use client"

import { Check, Copy } from "lucide-react"
import { toast } from "sonner"

import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"

import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

interface IProps extends React.ComponentProps<"div"> {
  textToCopy: string
  label?: string
  successMessage?: string
}

export function CopyButtonData({
  textToCopy,
  label = "Copy",
  successMessage = "Copied to clipboard!",
  className,
  ...props
}: IProps) {
  const { isCopied, copyToClipboard } = useCopyToClipboard()

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
    <div className={cn("flex items-center justify-end", className)} {...props}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="secondary"
            className="h-6 p-1.5"
            onClick={onCopy}
            aria-label={`Copy ${textToCopy}`}
          >
            {isCopied ? <Check className="size-3" /> : <Copy className="size-3" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    </div>
  )
}
