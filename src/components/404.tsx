"use client"

import Image from "next/image"
import Link from "next/link"

import React from "react"

import { ArrowLeft } from "lucide-react"

import Container from "./container"
import Logo from "./logo"
import { Button } from "./ui/button"

export default function NotFound404({
  message,
  linkText,
  link,
  showLogo = false,
}: {
  message: string
  linkText: string
  link: string
  showLogo?: boolean
}) {
  return (
    <Container>
      <div className="flex flex-col items-center">
        {showLogo && <Logo />}
        <Image
          alt="missing site"
          src={`/not-found/falling-gray.svg`}
          width={400}
          height={400}
          className="dark:hidden"
        />
        <Image
          alt="missing site"
          src={`/not-found/falling-dark.svg`}
          width={400}
          height={400}
          className="hidden dark:block"
        />
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{message}</h2>
        <Button asChild variant="default" size="sm" className="mt-6">
          <Link href={link}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {linkText}
          </Link>
        </Button>
      </div>
    </Container>
  )
}
