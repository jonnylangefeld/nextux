"use client"

import { withTheme } from "@rjsf/core"
import { RJSFSchema } from "@rjsf/utils"
import validator from "@rjsf/validator-ajv8"
import { useState } from "react"
import Highlight from "./Highlight"
import RecordingButton from "./RecordingButton"
import daisyUI from "../themes/rjsf/daisyUI"

const ThemedForm = withTheme(daisyUI)

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  schema: RJSFSchema
}

export default function MagicForm(props: Props) {
  const [formData, setFormData] = useState({})

  return (
    <div className="flex w-full max-w-xl flex-col gap-y-2">
      <div className="flex flex-row items-start justify-between gap-x-3 sm:gap-x-16 lg:gap-x-32">
        <div className="flex flex-col gap-y-2">
          <div className="font-semibold md:text-2xl">
            Fill out this demo form with your <Highlight>voice</Highlight> using the FormButler icon!
          </div>
          <div>The data in this form won&apos;t get collected.</div>
        </div>
        <RecordingButton setFormData={setFormData} schema={props.schema} />
      </div>
      <ThemedForm
        formData={formData}
        schema={props.schema}
        validator={validator}
        className="form-control w-full gap-y-2"
        onSubmit={(e) => console.log(e)}
      ></ThemedForm>
    </div>
  )
}
