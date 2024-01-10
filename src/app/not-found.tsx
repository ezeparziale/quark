import NotFound404 from "@/components/404"
import Container from "@/components/container"

export default function NotFoundPage() {
  return (
    <>
      <Container className="mt-20">
        <NotFound404
          message="Oops! Page not found"
          link="/"
          linkText="Back to home"
          showLogo
        />
      </Container>
    </>
  )
}
