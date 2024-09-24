import * as React from "react"

import { cn } from "@/lib/utils"
import { type VariantProps, cva } from "class-variance-authority"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        gray: "border-transparent bg-gray-500 text-white",
        "gray-subtle":
          "border-transparent bg-gray-200 text-gray-800 dark:bg-gray-800/90 dark:text-gray-200",
        blue: "border-transparent bg-blue-500 text-white",
        "blue-subtle":
          "border-transparent bg-blue-50 text-blue-500 dark:bg-blue-950 dark:text-blue-400",
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
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
