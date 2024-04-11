import Link from "next/link"

import { Button } from "./ui/button"

export default function HealthStatusButton() {
  return (
    <Button variant={"ghost"} asChild>
      <Link href={"/healthcheck"}>
        <div className="flex items-center justify-center">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-green-400"></span>
          </span>
          <span className="pl-1 text-xs text-green-800 dark:text-green-300">
            All systems normal.
          </span>
        </div>
      </Link>
    </Button>
  )
}
