import {
  Button,
  Column,
  Img,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components"

interface EmailProps {
  url: string
}

export default function ResetPasswordEmail({ url }: EmailProps) {
  return (
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              primary: "#18181b",
              "primary-foreground": "#fafafa",
            },
          },
        },
      }}
    >
      <Section>
        <Row>
          <Column>
            <Img
              src="https://raw.githubusercontent.com/ezeparziale/quark/main/public/logo/logo-light.png"
              alt="logo"
              width="32"
              height="32"
            />
          </Column>
        </Row>
      </Section>
      <Text>To reset your password, please click on the button below.</Text>
      <Button
        href={url}
        className="bg-primary text-primary-foreground inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium"
      >
        Reset password
      </Button>
    </Tailwind>
  )
}
