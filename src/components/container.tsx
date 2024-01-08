import { cn } from "@/lib/utils"

export default function Container({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("container mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8", className)}
      {...props}
    >
      {children}
    </div>
  )
}
