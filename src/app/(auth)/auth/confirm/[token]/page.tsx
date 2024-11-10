import { confirmEmail } from "@/actions/auth/confirm-email"

type Params = Promise<{ token: string }>

export default async function ConfirmTokenPage(props: { params: Params }) {
  const params = await props.params
  await confirmEmail({ token: params.token })
}
