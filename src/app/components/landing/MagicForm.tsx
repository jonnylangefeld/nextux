"use client"

import { withTheme } from "@rjsf/core"
import { RJSFSchema } from "@rjsf/utils"
import validator from "@rjsf/validator-ajv8"
import { useRef, useState } from "react"
import Confetti from "react-confetti"
import Highlight from "./Highlight"
import RecordingButton from "./RecordingButton"
import Button from "../Button"
import daisyUI from "../themes/rjsf/daisyUI"

const ThemedForm = withTheme(daisyUI)

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  schema: RJSFSchema
}

export default function MagicForm(props: Props) {
  const [formData, setFormData] = useState({})
  const [numberOfPieces, setNumberOfPieces] = useState(0)
  const formRef: React.RefObject<HTMLDivElement> = useRef(null)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  const parent = formRef.current?.getBoundingClientRect()
  const x = parent?.x || 0
  const y = parent?.y || 0
  const w = parent?.width || 0
  const h = parent?.height || 0

  console.log(parent)

  return (
    <>
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
          formData={formData}
          schema={props.schema}
          validator={validator}
          className="form-control w-full gap-y-2"
          onSubmit={(e) => console.log(e)}
          showErrorList={false}
        ></ThemedForm>

        <Button
          onClick={(e) => {
            setPosition({ top: e.pageY, left: e.pageX })
            setNumberOfPieces(numberOfPieces + 200)
          }}
        >
          on
        </Button>
        <Confetti
          numberOfPieces={numberOfPieces}
          confettiSource={{ x: 500, y: 1500, w: 10, h: 10 }}
          width={3000}
          height={3000}
          style={{ top: position.top - 1500, left: position.left - 500 }}
          recycle={false}
          wind={0.05}
          gravity={0.1}
          initialVelocityX={4}
          initialVelocityY={20}
        />
      </div>
    </>
  )
}
