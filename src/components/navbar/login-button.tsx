"use client"

import Link from "next/link"

import React, { Dispatch, SetStateAction } from "react"

import { useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"

import UserNav from "./user-nav"

export default function LoginButton({
  setOpenSheet,
}: {
  setOpenSheet?: Dispatch<SetStateAction<boolean>>
}) {
  const { data: session, status } = useSession()

  if (status === "authenticated") {
    return <UserNav setOpenSheet={setOpenSheet} email={session.user.email!} />
  }

  return (
    <div className="flex space-x-1">
      <Button asChild variant="outline" size="default">
        <Link href="/auth/login">Log in</Link>
      </Button>
      <Button asChild variant="default" size="default">
        <Link href="/auth/register">Sign up</Link>
      </Button>
    </div>
  )
}
