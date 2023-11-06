"use client"

import Form, { withTheme } from "@rjsf/core"
import { RJSFSchema } from "@rjsf/utils"
import validator from "@rjsf/validator-ajv8"
import React, { useEffect, useRef, useState } from "react"
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
  const stickyRef: React.RefObject<HTMLDivElement> = useRef(null)
  const railRef: React.RefObject<HTMLDivElement> = useRef(null)
  const tooltipRef: React.RefObject<HTMLDivElement> = useRef(null)

  const handleScroll = () => {
    const railTop = railRef.current?.getBoundingClientRect().top || 0
    const railBottom = railRef.current?.getBoundingClientRect().bottom || 0
    const stickyHeight = stickyRef.current?.getBoundingClientRect().height || 0

    if (railTop < 112) {
      tooltipRef.current?.classList.add(...["tooltip-left"])
      tooltipRef.current?.classList.remove(
        ...["tooltip-bottom", "md:tooltip-top", "before:translate-x-[-90%]", "lg:before:translate-x-[-50%]"]
      )
    } else {
      tooltipRef.current?.classList.remove(...["tooltip-left"])
      tooltipRef.current?.classList.add(
        ...["tooltip-bottom", "md:tooltip-top", "before:translate-x-[-90%]", "lg:before:translate-x-[-50%]"]
      )
    }
    if (railTop < 112 && railBottom > 112 + stickyHeight) {
      stickyRef.current?.classList.add(...["fixed", "top-[112px]"])
    } else {
      stickyRef.current?.classList.remove(...["fixed", "top-[112px]"])
    }
    if (railBottom <= 112 + stickyHeight) {
      stickyRef.current?.classList.add(...["absolute", "bottom-0"])
    } else {
      stickyRef.current?.classList.remove(...["absolute", "bottom-0"])
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <>
      <div className="relative flex w-full max-w-xl flex-col gap-y-2">
        <div className="flex flex-row items-start justify-between gap-x-3 sm:gap-x-16 lg:gap-x-32">
          <div className="flex flex-col gap-y-2">
            <div className="font-semibold md:text-2xl">
              Fill out this demo form with your <Highlight>voice</Highlight> using the FormButler icon!
            </div>
          </div>
          <div className="aspect-square h-[2.5rem] w-[2.5rem]"></div>
        </div>
        <div className="pointer-events-none absolute right-0 z-10 h-full w-[2.5rem]" ref={railRef}>
          <div className="pointer-events-auto" ref={stickyRef}>
            <RecordingButton
              tooltipRef={tooltipRef}
              className="tooltip-bottom md:tooltip-top before:translate-x-[-90%] lg:before:translate-x-[-50%]"
              setFormData={setFormData}
              formData={formData}
              schema={props.schema}
            />
          </div>
        </div>
        <ThemedForm
          ref={formRef}
          formData={formData}
          schema={props.schema}
          validator={validator}
          className="form-control w-full gap-y-2"
          onSubmit={() =>
            formEventEmitter.emit("fire", formRef.current?.formElement.current.querySelector('button[type="submit"]'))
          }
          onChange={(e) => setFormData(e.formData)}
          showErrorList={false}
        />
      </div>
      <Confetti numberOfPieces={150} eventEmitter={formEventEmitter} />
    </>
  )
}
