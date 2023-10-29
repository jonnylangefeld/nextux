import { Body, Container, Head, Heading, Html, Preview, Tailwind, Text } from "@react-email/components"
import React from "react"

export default function WaitListEmail() {
  return (
    <Html>
      <Head />
      <Preview>Keep an eye out for exciting updates!</Preview>
      <Tailwind>
        <Body className="m-auto font-sans">
          <Container className="mx-auto my-10 w-[465px] p-5">
            <Heading className="mx-0 my-8 p-0 text-center text-2xl font-normal">
              Thank you for joining the <strong>nextUX</strong>, wait list!
            </Heading>
            <Text className="text-sm">Hi 👋🏼</Text>
            <Text className="text-sm">
              We&apos;re excited to have you following updates from <strong>nextux.ai</strong>. We hope to deliver some
              more features soon! If you have any suggestions or feature requests or just want to say hi, please
              don&apos;t hesitate to reach out.
            </Text>
            <Text className="text-sm">
              Cheers,
              <br />
              <a href="https://x.com/jonnylangefeld">Jonny</a>
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
