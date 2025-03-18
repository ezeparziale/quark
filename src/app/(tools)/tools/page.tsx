import { redirect } from "next/navigation"

import { Suspense } from "react"

import { auth } from "@/auth"

import MaxWidthWrapper from "@/components/max-width-wrapper"

import AddToolButton from "./_components/add-tool-button"
import CardSkeleton from "./_components/card-skeleton"
import ToolSearch from "./_components/tool-search"
import ToolsSection from "./_components/tools-section"
import ViewSwitch from "./_components/view-switch"

type SearchParams = Promise<{ q?: string; view?: string }>

export default async function ToolsPage(props: { searchParams: SearchParams }) {
  const session = await auth()

  if (!session) {
    redirect("/auth/login?callbackUrl=/tools")
  }

  const searchParams = await props.searchParams
  const search = searchParams?.q || ""
  const view = searchParams?.view || "grid"

  return (
    <>
      <div className="border-border flex h-36 items-center border-b">
        <MaxWidthWrapper className="w-full">
          <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            My Tools
          </h2>
        </MaxWidthWrapper>
      </div>
      <div className="bg-muted/40 min-h-screen w-full">
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
