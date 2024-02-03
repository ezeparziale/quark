import NotFound404 from "@/components/404"
import MaxWidthWrapper from "@/components/max-width-wrapper"

export default function NotFoundPage() {
  return (
    <>
      <MaxWidthWrapper className="mt-20">
        <NotFound404
          message="Oops! Page not found"
          link="/"
          linkText="Back to home"
          showLogo
        />
      </MaxWidthWrapper>
    </>
  )
}
