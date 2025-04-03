"use client"

import type React from "react"
import { useState } from "react"

import { ChevronsUpDown, Trash } from "lucide-react"

import { cn } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

import { Checkbox } from "./ui/checkbox"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

type Option = {
  value: string | number
  label: string
  disabled?: boolean
}

interface ComboboxMultiProps {
  title: string
  options: Option[]
  selectedValues: Set<string | number>
  onChange?: (values: Array<string | number>) => void
  limit?: number
  className?: string
  form?: any
  field?: string
  disabled?: boolean
  maxSelections?: number
}

export function ComboboxMulti({
  title,
  options,
  selectedValues,
  onChange,
  limit = 10,
  className,
  form,
  field,
  disabled = false,
  maxSelections,
}: ComboboxMultiProps) {
  const [open, setOpen] = useState(false)

  const handleSelect = (value: string | number) => {
    const newSelectedValues = new Set(selectedValues)

    if (newSelectedValues.has(value)) {
      newSelectedValues.delete(value)
    } else {
      if (maxSelections && newSelectedValues.size >= maxSelections) {
        return
      }
      newSelectedValues.add(value)
    }

    if (form && field) {
      form.setValue(field, Array.from(newSelectedValues).sort(), {
        shouldValidate: true,
        shouldDirty: true,
      })
    }

    if (onChange) {
      onChange(Array.from(newSelectedValues).sort())
    }
  }

  const handleClear = () => {
    if (form && field) {
      form.setValue(field, [], {
        shouldValidate: true,
        shouldDirty: true,
      })
    }

    if (onChange) {
      onChange([])
    }

    selectedValues.clear()
  }

  const selectedOptions = options.filter((option) => selectedValues.has(option.value))
  const canSelectMore = !maxSelections || selectedValues.size < maxSelections

  return (
    <div className="relative">
      {selectedValues.size > 0 && (
        <div
          className="absolute top-1/2 right-8 z-10 -translate-y-1/2"
          onClick={(e) => e.stopPropagation()}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-muted flex h-6 w-6 cursor-pointer items-center justify-center rounded-sm"
                onClick={handleClear}
                aria-label="Clear selections"
              >
                <Trash className="size-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Clear selections</TooltipContent>
          </Tooltip>
        </div>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild disabled={disabled}>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label={`Select ${title}`}
            className={cn(
              "w-full justify-between",
              selectedValues.size > 0 ? "h-auto min-h-10 py-2" : "h-10",
              className,
            )}
          >
            <div className="flex flex-wrap items-center gap-1">
              {selectedValues.size === 0 ? (
                <span className="text-muted-foreground">Select {title}...</span>
              ) : selectedValues.size > limit ? (
                <Badge className="px-2">{selectedValues.size} selected</Badge>
              ) : (
                selectedOptions.map((option) => (
                  <Badge key={option.value} className="px-2">
                    {option.label}
                  </Badge>
                ))
              )}
            </div>
            <ChevronsUpDown className="size-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder={`Search ${title}...`} />
            <CommandEmpty>No {title} found.</CommandEmpty>
            <CommandList>
              <CommandGroup className="max-h-60 overflow-y-auto">
                {maxSelections && (
                  <div className="text-muted-foreground px-2 py-1.5 text-xs">
                    {selectedValues.size} of {maxSelections} selected
                  </div>
                )}
                {options.map((option) => {
                  const isSelected = selectedValues.has(option.value)
                  return (
                    <CommandItem
                      key={option.value}
                      disabled={option.disabled || (!isSelected && !canSelectMore)}
                      onSelect={() => handleSelect(option.value)}
                      className={cn(
                        option.disabled ? "opacity-50" : "",
                        !isSelected && !canSelectMore ? "opacity-50" : "",
                      )}
                    >
                      <Checkbox checked={isSelected} />
                      {option.label}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
              {selectedValues.size > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem className="justify-center text-center" asChild>
                      <div
                        onClick={(e) => {
                          e.stopPropagation()
                          handleClear()
                        }}
                        className="w-full cursor-pointer px-2 py-1.5 text-sm"
                      >
                        Clear selections
                      </div>
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
