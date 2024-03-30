import MaxWidthWrapper from "@/components/max-width-wrapper"

export default function ToolsPage() {
  return (
    <>
      <div className="flex h-36 items-center border-b border-border">
        <MaxWidthWrapper>
          <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            My Tools
          </h2>
        </MaxWidthWrapper>
      </div>
      <div className="min-h-screen w-full bg-muted/40 dark:bg-background">
        <MaxWidthWrapper>
          <div className="my-10 grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3"></div>
        </MaxWidthWrapper>
      </div>
    </>
  )
}
