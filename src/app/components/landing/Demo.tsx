import React from "react"
import Frame from "./Frame"
import MagicForm from "./MagicForm"
import Section from "./Section"

export default function Hero() {
  return (
    <Section className="z-10 -mt-40" id="demo">
      <Frame>
        <MagicForm />
      </Frame>
    </Section>
  )
}
