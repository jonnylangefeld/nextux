"use client"

import { useRive, useStateMachineInput } from "@rive-app/react-canvas"
import { withTheme } from "@rjsf/core"
import { RJSFSchema } from "@rjsf/utils"
import validator from "@rjsf/validator-ajv8"
import { useEffect, useState } from "react"
import { ExtractRequest } from "@/app/lib/proto/types"
import daisyUI from "../themes/rjsf/daisyUI"

const initialToolTipMessages = ["Click the FormButtler icon to help you fill out this form", "Try it out!"]
const tooltipDuration = 5000

const ThemedForm = withTheme(daisyUI)

const schema: RJSFSchema = {
  type: "object",
  description: "The personal data typically put into a contact form",
  properties: {
    firstName: {
      title: "First Name",
      type: "string",
      description: "the first name of the person",
    },
    lastName: {
      title: "Last Name",
      type: "string",
      description: "the first name of the person",
    },
    address: {
      type: "object",
      title: "Address",
      description: "the home address of the person",
      properties: {
        street: {
          title: "Street",
          type: "string",
          description: "the street of the address including the street number",
        },
        city: {
          title: "City",
          type: "string",
          description:
            "the city of the address. Use your knowledge about cities and their zip codes to get the right one",
        },
        stateAbbreviation: {
          title: "State",
          type: "string",
          description: "the two letter state abbreviation of the address",
          pattern: "^[A-Z]{2}$",
          enum: [
            "AL",
            "AK",
            "AZ",
            "AR",
            "CA",
            "CO",
            "CT",
            "DE",
            "FL",
            "GA",
            "HI",
            "ID",
            "IL",
            "IN",
            "IA",
            "KS",
            "KY",
            "LA",
            "ME",
            "MD",
            "MA",
            "MI",
            "MN",
            "MS",
            "MO",
            "MT",
            "NE",
            "NV",
            "NH",
            "NJ",
            "NM",
            "NY",
            "NC",
            "ND",
            "OH",
            "OK",
            "OR",
            "PA",
            "RI",
            "SC",
            "SD",
            "TN",
            "TX",
            "UT",
            "VT",
            "VA",
            "WA",
            "WV",
            "WI",
            "WY",
          ],
        },
        zipCode: {
          title: "Zip Code",
          type: "string",
          description: "the zip code of the address",
          pattern: "^\\d{5}$",
        },
      },
      required: ["street", "city", "stateAbbreviation", "zipCode"],
    },
    emailAddress: {
      title: "Email Address",
      type: "string",
      format: "email",
      description: "the email address of the person",
    },
    birthDate: {
      title: "Birth Date",
      type: "string",
      description: "the date of birth of the person in YYYY-MM-DD",
      pattern: "^\\d{4}-\\d{2}-\\d{2}$",
    },
  },
  required: ["firstName", "lastName", "address", "birthDate"],
}

export default function MagicForm() {
  const [formData, setFormData] = useState({})
  const [recording, setRecording] = useState(false)
  const [tooltipOpen, setTooltipOpen] = useState(true)
  const [tooltipText, setTooltipText] = useState(initialToolTipMessages[0])
  const [tooltipMessages, setTooltipMessages] = useState<string[]>(initialToolTipMessages)
  const [tooltipCycler, setTooltipCycler] = useState<NodeJS.Timer | null>(null)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const { rive, RiveComponent } = useRive({
    src: "/formbuttler.riv",
    stateMachines: "recording",
    autoplay: true,
  })
  const animateStart = useStateMachineInput(rive, "recording", "start")
  const animateStop = useStateMachineInput(rive, "recording", "stop")
  const animateUploaded = useStateMachineInput(rive, "recording", "uploaded")
  const animateCenter = useStateMachineInput(rive, "recording", "center")
  const animateLeft = useStateMachineInput(rive, "recording", "left")
  const animateRight = useStateMachineInput(rive, "recording", "right")

  const cycleTooltips = (messages: string[]) => {
    let i = 0
    const intervalId = setInterval(() => {
      setTooltipText(messages[i])
      i = (i + 1) % messages.length
    }, tooltipDuration)
    return intervalId
  }

  useEffect(() => {
    const intervalId = cycleTooltips(tooltipMessages)
    setTooltipCycler(intervalId)

    // Cleanup the interval on unmount
    return () => {
      clearInterval(intervalId)
    }
  }, [tooltipMessages])

  const handleRecording = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.log("WebRTC not supported")
      return
    }

    const audioContext = new AudioContext()
    const analyser = audioContext.createAnalyser()
    analyser.fftSize = 256 // Reducing FFT size for quicker analysis
    analyser.smoothingTimeConstant = 0.1

    if (recording && mediaRecorder) {
      mediaRecorder.stop()

      // Stop all tracks to ensure that the microphone is released
      mediaRecorder.stream.getTracks().forEach((track) => track.stop())

      setRecording(false)
    } else {
      // Request permission and start recording only when the button is clicked
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const newMediaRecorder = new MediaRecorder(stream)

          const source = audioContext.createMediaStreamSource(stream)
          source.connect(analyser)

          const dataArray = new Uint8Array(analyser.frequencyBinCount)

          // Check amplitude periodically
          const animateFrequencies = setInterval(() => {
            analyser.getByteFrequencyData(dataArray)

            const maxRelevantIndex = 55
            const segmentSize = Math.floor(maxRelevantIndex / 3)

            const segments = [
              dataArray.slice(0, segmentSize),
              dataArray.slice(segmentSize, 2 * segmentSize),
              dataArray.slice(2 * segmentSize, maxRelevantIndex),
            ]

            const barValues = segments.map((segment) => {
              // Get the max value for each segment
              const max = Math.max(...Array.from(segment))
              // Normalize the value to be between 0 and 100
              return (max / 255) * 100
            })

            const center = barValues[0]
            const left = barValues[1]
            const right = barValues[2]

            if (animateCenter) {
              animateCenter.value = center
            }
            if (animateLeft) {
              animateLeft.value = left
            }
            if (animateRight) {
              animateRight.value = right
            }
          }, 50)

          setTooltipMessages([
            "You can talk like you normally would with a friend or colleague",
            "It helps to spell out names like you would in a phone call",
            "You can say things like 'my name is Peter, that's P-E-T-E-R'",
          ])

          // Stop checking when recording stops
          newMediaRecorder.onstop = () => {
            clearInterval(animateFrequencies)
            if (tooltipCycler) {
              clearInterval(tooltipCycler)
            }
            setTooltipOpen(false)
            console.log("Stopped recording")
          }

          newMediaRecorder.ondataavailable = async (event) => {
            if (event.data.size > 0) {
              animateStop?.fire()
              const reader = new FileReader()

              reader.onloadend = async function () {
                if (reader.result) {
                  const base64Audio = (reader.result as string).split(",")[1] // Splitting to get only the Base64 data

                  const body: ExtractRequest = {
                    jsonSchema: Buffer.from(JSON.stringify(schema)).toString("base64"),
                    document: base64Audio,
                  }

                  const resp = await fetch("/api/extract", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body),
                  })
                  setFormData(await resp.json())

                  animateUploaded?.fire()
                  setTooltipOpen(true)
                  setTooltipText(initialToolTipMessages[0])
                  setTooltipMessages(initialToolTipMessages)
                }
              }

              reader.readAsDataURL(event.data)
            }
          }
          newMediaRecorder.start()
          setMediaRecorder(newMediaRecorder)
          setRecording(true)
          animateStart?.fire()
          setTooltipText("Start speaking to fill out this form")
        })
        .catch((err) => {
          console.log("Permission denied", err)
        })
    }
  }

  return (
    <div className="flex w-full max-w-xl flex-col gap-y-2">
      <div className="flex flex-row items-start justify-between">
        <div className="flex-nowrap font-semibold md:text-2xl">Fill out this form</div>
        <div
          className={`${
            tooltipOpen ? "tooltip-open" : ""
          } light:before:shadow-[0px_0px_28px_0px_#fff] tooltip tooltip-left xl:tooltip-top before:max-w-[10rem] before:content-[attr(data-tip)] md:before:max-w-[20rem]`}
          data-tip={tooltipText}
        >
          <div className="relative aspect-square w-[2.5rem] cursor-pointer" onClick={handleRecording}>
            <div className="absolute -z-20 h-full w-full scale-100 rounded-md bg-white blur-lg" />
            <RiveComponent />
          </div>
        </div>
      </div>
      <ThemedForm
        formData={formData}
        schema={schema}
        validator={validator}
        className="form-control w-full gap-y-2"
        onSubmit={(e) => console.log(e)}
      ></ThemedForm>
    </div>
  )
}
