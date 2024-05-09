import { redirect } from "next/navigation"

import { Suspense } from "react"

import { auth } from "@/auth"

import MaxWidthWrapper from "@/components/max-width-wrapper"

import AddToolButton from "./_components/add-tool-button"
import CardSkeleton from "./_components/card-skeleton"
import ToolSearch from "./_components/tool-search"
import ToolsSection from "./_components/tools-section"
import ViewSwitch from "./_components/view-switch"

export default async function ToolsPage({
  searchParams,
}: {
  searchParams?: {
    q?: string
    view?: string
  }
}) {
  const session = await auth()

  if (!session) {
    redirect("/auth/login?callbackUrl=/tools")
  }

  const search = searchParams?.q || ""
  const view = searchParams?.view || "grid"

  return (
    <>
      <div className="flex h-36 items-center border-b border-border">
        <MaxWidthWrapper>
          <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            My Tools
          </h2>
        </MaxWidthWrapper>
      </div>
      <div className="min-h-screen w-full bg-muted/40">
        <MaxWidthWrapper>
          <div className="flex items-center space-x-2 pb-6">
            <ToolSearch />
            <ViewSwitch />
            <AddToolButton />
          </div>
          <Suspense fallback={<CardSkeleton view={view} />}>
            <ToolsSection view={view} search={search} />
          </Suspense>
        </MaxWidthWrapper>
      </div>
    </>
  )
}
