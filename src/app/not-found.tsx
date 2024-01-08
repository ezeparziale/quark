import NotFound404 from "@/components/404"
import Container from "@/components/container"

export default function NotFoundPage() {
  return (
    <>
      <Container className="mt-14 border-t border-transparent">
        <NotFound404 message="Oops! Page not found" link="/" linkText="Back to home" />
      </Container>
    </>
  )
}
