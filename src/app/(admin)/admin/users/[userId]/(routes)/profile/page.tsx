import { notFound } from "next/navigation"

import prismadb from "@/lib/prismadb"
import { protectPage } from "@/lib/rbac"

import { PageSection } from "@/components/page-header"

import { ProfileForm } from "./_components/profile-form"

type Params = Promise<{ userId: number }>

export default async function UserProfilePage(props: { params: Params }) {
  await protectPage({ permission: "admin:all" })

  const params = await props.params
  const userId = Number(params.userId)
  if (isNaN(userId) || userId <= 0) {
    notFound()
  }

  const user = await prismadb.user.findUnique({
    where: { id: userId },
    select: {
      firstName: true,
      lastName: true,
      bio: true,
      phone: true,
      websiteUrl: true,
      linkedinUrl: true,
      githubUrl: true,
      jobTitle: true,
      department: true,
    },
  })

  if (!user) notFound()

  const profile = {
    firstName: user.firstName,
    lastName: user.lastName,
    bio: user.bio,
    phone: user.phone,
    websiteUrl: user.websiteUrl,
    linkedinUrl: user.linkedinUrl,
    githubUrl: user.githubUrl,
    jobTitle: user.jobTitle,
    department: user.department,
  }

  return (
    <>
      <PageSection title="Profile" description="Manage user information." />
      <ProfileForm profile={profile} userId={userId} />
    </>
  )
}
