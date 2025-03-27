import * as React from "react"

import { Column } from "@tanstack/react-table"
import { CheckIcon, LucideIcon, PlusCircle } from "lucide-react"

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
import { Separator } from "@/components/ui/separator"

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
  options: {
    label: string
    value: string
    icon?: LucideIcon
  }[]
  isBoolean?: boolean
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
  isBoolean = false,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues()
  const selectedValuesString = new Set<string>(column?.getFilterValue() as string[])
  const selectedValuesBoolean = new Set<boolean>(column?.getFilterValue() as boolean[])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircle className="h-4 w-4" />
          {title}
          {selectedValuesString?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValuesString.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValuesString.size > 2 ? (
                  <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                    {selectedValuesString.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) =>
                      isBoolean
                        ? selectedValuesBoolean.has(option.value === "true")
                        : selectedValuesString.has(option.value),
                    )
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = isBoolean
                  ? selectedValuesBoolean.has(option.value === "true")
                  : selectedValuesString.has(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        if (isBoolean) {
                          selectedValuesBoolean.delete(option.value === "true")
                        } else {
                          selectedValuesString.delete(option.value)
                        }
                      } else {
                        if (isBoolean) {
                          selectedValuesBoolean.add(option.value === "true")
                        } else {
                          selectedValuesString.add(option.value)
                        }
                      }
                      const filterValues = isBoolean
                        ? Array.from(selectedValuesBoolean)
                        : Array.from(selectedValuesString)
                      column?.setFilterValue(
                        filterValues.length ? filterValues : undefined,
                      )
                    }}
                  >
                    <div
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <CheckIcon className={cn("h-4 w-4")} />
                    </div>
                    {option.icon && (
                      <option.icon className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{option.label}</span>
                    {facets?.get(
                      isBoolean ? option.value === "true" : option.value,
                    ) && (
                      <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {facets.get(isBoolean ? option.value === "true" : option.value)}
                      </span>
                    )}
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selectedValuesString.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column?.setFilterValue(undefined)}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
