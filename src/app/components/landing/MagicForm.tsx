"use client"

import Form, { withTheme } from "@rjsf/core"
import { RJSFSchema } from "@rjsf/utils"
import validator from "@rjsf/validator-ajv8"
import { useRef, useState } from "react"
import { EventEmitter } from "events"
import Highlight from "./Highlight"
import RecordingButton from "./RecordingButton"
import Confetti from "../Confetti"
import daisyUI from "../themes/rjsf/daisyUI"

const ThemedForm = withTheme(daisyUI)
const formEventEmitter = new EventEmitter()

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  schema: RJSFSchema
}

export default function MagicForm(props: Props) {
  const [formData, setFormData] = useState({})
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formRef: React.RefObject<Form<any, RJSFSchema, any>> = useRef(null)

  return (
    <div className="flex w-full max-w-xl flex-col gap-y-2">
      <div className="flex flex-row items-start justify-between gap-x-3 sm:gap-x-16 lg:gap-x-32">
        <div className="flex flex-col gap-y-2">
          <div className="font-semibold md:text-2xl">
            Fill out this demo form with your <Highlight>voice</Highlight> using the FormButler icon!
          </div>
          <div>The data in this form won&apos;t get collected.</div>
        </div>
        <RecordingButton setFormData={setFormData} formData={formData} schema={props.schema} />
      </div>
      <ThemedForm
        ref={formRef}
        formData={formData}
        schema={props.schema}
        validator={validator}
        className="form-control w-full gap-y-2"
        onSubmit={() => {
          formEventEmitter.emit("fire", formRef.current?.formElement.current.querySelector('button[type="submit"]'))
        }}
        showErrorList={false}
      />
      <Confetti numberOfPieces={150} eventEmitter={formEventEmitter} />
    </div>
  )
}
