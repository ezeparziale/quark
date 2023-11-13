import Image from "next/image"
import Link from "next/link"

import { ArrowLeft } from "lucide-react"

import Container from "@/components/container"
import { Button } from "@/components/ui/button"

export default function UserNotFound() {
  return (
    <Container>
      <div className="mt-20 flex flex-col items-center space-y-2">
        <h1 className="text-4xl">404</h1>
        <Image
          alt="missing site"
          src="/not-found/falling-gray.svg"
          width={400}
          height={400}
          className="dark:hidden"
        />
        <Image
          alt="missing site"
          src="/not-found/falling-dark.svg"
          width={400}
          height={400}
          className="hidden dark:block"
        />
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
          Oops! User not found
        </h2>
        <Button asChild variant="default" size="sm">
          <Link href="/admin/users">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to users
          </Link>
        </Button>
      </div>
    </Container>
  )
}
