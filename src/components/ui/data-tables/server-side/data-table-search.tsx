"use client"

import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"

interface DataTableSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function DataTableSearch({
  value,
  onChange,
  placeholder = "Search...",
}: DataTableSearchProps) {
  return (
    <div className="relative max-w-sm">
      <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-8"
      />
    </div>
  )
}
