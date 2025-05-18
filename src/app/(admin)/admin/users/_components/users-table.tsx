"use client"

import { useRouter } from "next/navigation"

import { use, useCallback } from "react"

import { User } from "@prisma/client"
import { CheckCircle, Clock, Verified, XCircle } from "lucide-react"

import { DataTable } from "@/components/ui/data-tables/data-table"

import { columns } from "./columns"
import UsersEmptyStateTable from "./users-empty-state-table"

type UserData = Omit<User, "password" | "usernameUpdatedAt">

export default function UsersTable({
  usersPromise,
}: {
  usersPromise: Promise<UserData[]>
}) {
  const data = use(usersPromise)
  const router = useRouter()

  const handleRowClick = useCallback(
    (row: UserData) => {
      router.push(`/admin/users/${row.id}`)
    },
    [router],
  )

  return (
    <DataTable
      columns={columns}
      data={data}
      searchFieldLabel={"users"}
      emptyState={<UsersEmptyStateTable />}
      hiddenColumns={{ ID: false, "Created At": false, "Updated At": false }}
      filters={userFilters}
      onRowClick={handleRowClick}
    />
  )
}

const userFilters = [
  {
    column: "Role",
    title: "Role",
    options: [
      { label: "Admin", value: "true" },
      { label: "User", value: "false" },
    ],
    isBoolean: true,
  },
  {
    column: "Verified",
    title: "Verified",
    options: [
      { label: "Verified", value: "true", icon: Verified },
      { label: "Pending", value: "false", icon: Clock },
    ],
    isBoolean: true,
  },
  {
    column: "Active",
    title: "Active",
    options: [
      { label: "Active", value: "true", icon: CheckCircle },
      { label: "Inactive", value: "false", icon: XCircle },
    ],
    isBoolean: true,
  },
]
