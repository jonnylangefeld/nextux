import dynamic from "next/dynamic"
import React from "react"
import { wittyFormSchema, wittyFormUISchema } from "@/app/lib/rjsfSchemas"
import Frame from "./Frame"
import MagicFormSkeleton from "./MagicFormSkeleton"
import Section from "./Section"

export default function Demo() {
  const MagicForm = dynamic(() => import("./MagicForm"), {
    ssr: false,
    loading: () => <MagicFormSkeleton />,
  })
  return (
    <Section className="z-10 -mt-44" id="demo">
      <Frame>
        <MagicForm schema={wittyFormSchema} uiSchema={wittyFormUISchema} />
      </Frame>
    </Section>
  )
}
