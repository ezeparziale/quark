import NotFound404 from "@/components/404"

export default function RoleNotFound() {
  return (
    <NotFound404
      message="Oops! Role not found"
      link="/admin/roles"
      linkText="Back to roles"
    />
  )
}
