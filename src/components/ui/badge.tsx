import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/70",
        success:
          "border-transparent bg-green-500 text-white [a&]:hover:bg-green-500/90 dark:bg-green-700 dark:text-green-100",
        "success-subtle":
          "border-transparent bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
        warning:
          "border-transparent bg-yellow-400 text-black [a&]:hover:bg-yellow-400/90 dark:bg-yellow-600 dark:text-yellow-100",
        "warning-subtle":
          "border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400",
        info:
          "border-transparent bg-blue-500 text-white [a&]:hover:bg-blue-500/90 dark:bg-blue-700 dark:text-blue-100",
        "info-subtle":
          "border-transparent bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        gray: "border-transparent bg-gray-500 text-white",
        "gray-subtle":
          "border-transparent bg-gray-200 text-gray-800 dark:bg-gray-800/90 dark:text-gray-200",
        blue: "border-transparent bg-blue-500 text-white",
        "blue-subtle":
          "border-transparent bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
        purple: "border-transparent bg-purple-500 text-white",
        "purple-subtle":
          "border-transparent bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-400",
        amber: "border-transparent bg-amber-400 text-black",
        "amber-subtle":
          "border-transparent bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-500",
        red: "border-transparent bg-red-500 text-white",
        "red-subtle":
          "border-transparent bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
        pink: "border-transparent bg-pink-500 text-white",
        "pink-subtle":
          "border-transparent bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-400",
        green: "border-transparent bg-green-600 text-white",
        "green-subtle":
          "border-transparent bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
        teal: "border-transparent bg-teal-600 text-white",
        "teal-subtle":
          "border-transparent bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-200",
        orange: "border-transparent bg-orange-500 text-white",
        "orange-subtle":
          "border-transparent bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400",
        yellow: "border-transparent bg-yellow-400 text-black",
        "yellow-subtle":
          "border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400",
        indigo: "border-transparent bg-indigo-500 text-white",
        "indigo-subtle":
          "border-transparent bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400",
        violet: "border-transparent bg-violet-500 text-white",
        "violet-subtle":
          "border-transparent bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400",
        cyan: "border-transparent bg-cyan-500 text-white",
        "cyan-subtle":
          "border-transparent bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
