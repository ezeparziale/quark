import { Suspense } from "react"

import { withRoles } from "@/lib/rbac"
import prismadb from "@/utils/prismadb"
import { KeySquare, UnlockIcon, User } from "lucide-react"

import CardKPI from "./_components/card-kpi"
import CardKPILoading from "./_components/card-kpi-loading"

const AdminPage = async () => {
  const totalUsers = await prismadb.user.count()
  const totalRoles = await prismadb.role.count()
  const totalPermissions = await prismadb.permission.count()

  return (
    <>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Admin
      </h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback={<CardKPILoading />}>
          <CardKPI title={"Users"} Icon={User} kpi={totalUsers} />
        </Suspense>
        <Suspense fallback={<CardKPILoading />}>
          <CardKPI title={"Roles"} Icon={UnlockIcon} kpi={totalRoles} />
        </Suspense>
        <Suspense fallback={<CardKPILoading />}>
          <CardKPI title={"Permissions"} Icon={KeySquare} kpi={totalPermissions} />
        </Suspense>
      </div>
    </>
  )
}

export default withRoles(AdminPage, ["admin:all"])
