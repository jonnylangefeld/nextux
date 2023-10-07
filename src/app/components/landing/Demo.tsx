import dynamic from "next/dynamic"
import React from "react"
import { contactFormSchema } from "@/app/lib/rjsfSchemas"
import Frame from "./Frame"
import Section from "./Section"

export default function Demo() {
  const MagicForm = dynamic(() => import("./MagicForm"), { ssr: false })
  return (
    <Section className="z-10 -mt-44" id="demo">
      <Frame>
        <MagicForm schema={contactFormSchema} />
      </Frame>
    </Section>
  )
}
