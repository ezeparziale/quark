import NotFound404 from "@/components/404"

export default function ToolNotFound() {
  return (
    <NotFound404
      message="Oops! Tool not found"
      link="/admin/tools"
      linkText="Back to tools"
    />
  )
}
