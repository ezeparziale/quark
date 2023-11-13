"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"
import { Check, Plus, Trash } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

type IPros = {
  title: string
  options: {
    value: string | number
    label: string
    disabled?: boolean
  }[]
  selectedValues: Set<string | number>
  limit?: number
  className?: string
  form?: any
}

export function ComboboxMulti({
  title,
  options,
  selectedValues,
  limit = 20,
  className,
  form,
}: IPros) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        asChild
        className={cn(
          "h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
      >
        <div className="flex w-auto items-center rounded-md border border-input bg-background px-1 py-2 text-sm hover:ring-1 hover:ring-ring">
          <div className="flex grow items-center justify-start">
            {selectedValues?.size > 0 && (
              <>
                <div className="">
                  {selectedValues.size > limit ? (
                    <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                      {selectedValues.size} selected
                    </Badge>
                  ) : (
                    options
                      .filter((option) => selectedValues.has(option.value))
                      .map((option) => (
                        <Badge
                          variant="secondary"
                          key={option.value}
                          className="m-0.5 rounded-sm px-1 font-normal"
                        >
                          {option.label}
                        </Badge>
                      ))
                  )}
                </div>
              </>
            )}
          </div>
          {selectedValues.size > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                selectedValues.clear()
                form.setValue("id", [], {
                  shouldValidate: true,
                  shouldDirty: true,
                })
                setOpen(false)
              }}
            >
              <div className="w-50 flex-initial">
                <div className="flex flex-initial">
                  <Trash className="h-4 w-4" />
                </div>
              </div>
            </Button>
          )}
          <Separator orientation="vertical" className="mr-1 h-4" />
          <Button variant="ghost" size="sm" className="">
            <div className="w-50 flex-initial">
              <div className="flex flex-initial">
                <Plus className="h-4 w-4" />
              </div>
            </div>
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 md:w-auto" align="start">
        <Command>
          <CommandInput placeholder={`Search ${title}...`} />
          <CommandEmpty>No {title} found.</CommandEmpty>
          <CommandGroup className="max-h-32 overflow-y-auto p-0">
            {options.map((option) => {
              const isSelected = selectedValues.has(option.value)
              return (
                <CommandItem
                  key={option.value}
                  disabled={option.disabled}
                  className={option.disabled ? "opacity-50" : ""}
                  onSelect={(currentValue) => {
                    if (isSelected) {
                      selectedValues.delete(option.value)
                    } else {
                      selectedValues.add(option.value)
                    }
                    form.setValue("id", Array.from(selectedValues).sort(), {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                    setValue(currentValue === value ? "" : currentValue)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      isSelected ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {option.label}
                </CommandItem>
              )
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
