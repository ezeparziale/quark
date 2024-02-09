import MaxWidthWrapper from "@/components/max-width-wrapper"

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MaxWidthWrapper>{children}</MaxWidthWrapper>
    </>
  )
}
