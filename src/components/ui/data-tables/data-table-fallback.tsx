"use client"

import Image from "next/image"

export function DataTableFallback() {
  return (
    <div
      className="bg-destructive/5 dark:bg-destructive/10 border-destructive flex flex-1 flex-col items-center space-y-3 rounded-md border p-4 text-center"
      role="alert"
    >
      <div className="relative mb-6 h-64 w-64">
        <Image
          src="/error/crashed-error-gray.svg"
          alt="Error illustration"
          fill
          className="block object-contain dark:hidden"
        />
        <Image
          src="/error/crashed-error-white.svg"
          alt="Error illustration"
          fill
          className="hidden object-contain dark:block"
        />
      </div>
      <h2 className="mb-2 text-xl font-bold">Oops! Something went wrong</h2>
    </div>
  )
}
