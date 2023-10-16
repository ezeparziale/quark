import Link from "next/link"
import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth"
import prismadb from "@/utils/prismadb"
import { Plus } from "lucide-react"
import { getServerSession } from "next-auth"

import Container from "@/components/container"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import { DataTable } from "./_components/data-tables"
import { columns } from "./columns"

export default async function UsersAdmin() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login?callbackUrl=/admin/users")
  }

  const data = await prismadb.user.findMany()

  const roles = await prismadb.user.findUnique({
    where: { id: session.user.id },
    include: {
      roles: {
        include: {
          role: { include: { permissions: { include: { permission: true } } } },
        },
      },
    },
  })
  console.log(roles?.roles)
  return (
    <>
      <Container>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold tracking-tight">Users</h2>
            <p className="text-muted-foreground">Manage all users account.</p>
          </div>
          <Button asChild>
            <Link href="/admin/users/new-user">
              <Plus className="h-4 w-4" />
              <span className="sr-only">create user</span>
              <span className="ml-2 hidden md:block">Create</span>
            </Link>
          </Button>
        </div>
        <Separator className="my-6" />
        <DataTable columns={columns} data={data} />
      </Container>
    </>
  )
}
