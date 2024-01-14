import { changeEmail } from "@/actions/auth/change-email"

export default async function ChangeEmailTokenPage({
  params,
}: {
  params: { token: string }
}) {
  await changeEmail({ token: params.token })
}
