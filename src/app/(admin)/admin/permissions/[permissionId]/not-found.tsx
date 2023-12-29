import NotFound404 from "@/components/404"

export default function PermissionNotFound() {
  return (
    <NotFound404
      message="Oops! Permission not found"
      link="/admin/permissions"
      linkText="Back to permissions"
    />
  )
}
