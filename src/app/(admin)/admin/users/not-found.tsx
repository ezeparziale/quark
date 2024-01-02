import NotFound404 from "@/components/404"

export default function NotFound() {
  return (
    <NotFound404
      message="Oops! User not found"
      link="/admin/users"
      linkText="Back to users"
    />
  )
}
