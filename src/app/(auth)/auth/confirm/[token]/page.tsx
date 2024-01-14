import { confirmEmail } from "@/actions/auth/confirm-email"

export default async function ConfirmTokenPage({
  params,
}: {
  params: { token: string }
}) {
  await confirmEmail({ token: params.token })
}
