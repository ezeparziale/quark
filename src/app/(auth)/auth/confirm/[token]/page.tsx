import { confirmEmail } from "@/actions/auth/confirm-email"
import { delay } from "@/lib/utils"

export default async function ConfirmTokenPage({
  params,
}: {
  params: { token: string }
}) {
  await confirmEmail({ token: params.token })
}
