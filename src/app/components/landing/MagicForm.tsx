"use client"

import { withTheme } from "@rjsf/core"
import { RJSFSchema } from "@rjsf/utils"
import validator from "@rjsf/validator-ajv8"
import Image from "next/image"
import { useState } from "react"
import { ExtractRequest } from "@/app/lib/proto/types"
import daisyUI from "../themes/rjsf/daisyUI"

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
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)

  const handleRecording = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.log("WebRTC not supported")
      return
    }

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
          newMediaRecorder.ondataavailable = async (event) => {
            if (event.data.size > 0) {
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
                  console.log(resp)
                  setFormData(await resp.json())
                }
              }

              reader.readAsDataURL(event.data)
            }
          }
          newMediaRecorder.start()
          setMediaRecorder(newMediaRecorder)
          setRecording(true)
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
        <div className="relative aspect-square w-[40px] cursor-pointer md:w-[40px]" onClick={handleRecording}>
          <div className="absolute h-full w-full scale-100 rounded-md bg-white blur-lg" />
          <Image src="icon.svg" alt="nextux buttler icon" fill />
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
