import Link from "next/link"

import Container from "@/components/container"
import { Button } from "@/components/ui/button"

export default function RoleNotFound() {
  return (
    <Container>
      <div className="flex h-screen flex-col items-center justify-center">
        <div className="rounded-lg border p-4">
          <div className="flex flex-col space-y-6">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-slate-50 md:text-2xl">
              Oops! Role not found
            </h2>
            <Button asChild variant="default" size="sm" className="font-bold">
              <Link href="/admin/roles">Back to roles</Link>
            </Button>
          </div>
        </div>
      </div>
    </Container>
  )
}
