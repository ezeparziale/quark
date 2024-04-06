"use client"

import { forwardRef } from "react"

import { AddToolFavorite } from "@/actions/users/add-tool-favorite"
import { cn } from "@/lib/utils"
import { Loader2, Star } from "lucide-react"
import { useFormState, useFormStatus } from "react-dom"

const initialState = {
  message: "",
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm",
        "px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent",
        "hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        "flex-1",
      )}
    >
      <div className="flex flex-1 items-center justify-between">
        <span>Add Favorite</span>
        {pending ? (
          <Loader2 className="ml-2 size-4 animate-spin" />
        ) : (
          <Star className="ml-2 size-4" />
        )}
      </div>
    </button>
  )
}

export const AddFavorite = forwardRef(({ id }: { id: number }, ref: React.Ref<any>) => {
  const [_, formAction] = useFormState(AddToolFavorite, initialState)

  return (
    <form action={formAction} className="flex flex-1">
      <input type="hidden" name="id" value={id} />
      <SubmitButton />
    </form>
  )
})

AddFavorite.displayName = "AddFavorite"
