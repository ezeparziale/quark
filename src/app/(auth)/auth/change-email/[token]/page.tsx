import { changeEmail } from "@/actions/auth/change-email"

type Params = Promise<{ token: string }>

export default async function ChangeEmailTokenPage(props: { params: Params }) {
  const params = await props.params
  await changeEmail({ token: params.token })
}
